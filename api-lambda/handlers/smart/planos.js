import {getAll, getById, insert, updateById, getCount, executeQuery} from '../../utils/database.js';
import {success, notFound, serverError} from '../../utils/response.js';
import {updateProduct, updatePrice, createPrice, singleShotCreate} from '../stripe/stripe.js';

import {
    validateRequiredFields,
    filterAllowedFields,
    createErrorResponse,
    validateFieldValues
} from '../../utils/dataValidation.js';

const REQUIRED_FIELDS = ['nome', 'display_name', 'isPaymentActive', 'valor_atual'];
const UNIQUE_FIELDS = ['nome', 'display_name'];
const ALLOWED_UPDATE_FIELDS = ['nome', 'display_name', 'descricao',
    'duracao_dias', 'valor_atual', 'isPaymentActive', 'paymentInterval',
    'paymentInterval_count', 'paymentCurrency', 'status', 'obs'];
const ALLOWED_SORT_FIELDS = ['id', 'nome', 'display_name'];
const VALID_STATUS = ['ativo', 'inativo', 'cancelado', 'promo', 'suspenso'];
const SUSPEND_PAYMENT = ['inativo', 'cancelado', 'suspenso'];

async function _createStripeProductAndUpdatePlano(plano) {
    try {
        console.log(`...iniciando integração com stripe para plano id ${plano.id}`);
        const stripeProductPayload = {
            name: plano.nome,
            description: plano.descricao,
            metadata: {
                internal_id: plano.id,
                display_name: plano.display_name,
                origem: plano.origem,
            },
            default_price_data: {
                unit_amount: Math.round(plano.valor_atual * 100),
                currency: plano.paymentCurrency || 'brl',
                recurring: {
                    interval: plano.paymentInterval || 'month',
                    interval_count: plano.paymentInterval_count || 1,
                },
            },
        };
        const paymentResource = await singleShotCreate(stripeProductPayload);
        const stripeResponse = JSON.parse(paymentResource.body || '{}');

        if (paymentResource.statusCode >= 400 || stripeResponse.error) {
            const errorMessage = stripeResponse.error?.message || '[STRIPE API ERROR] During creation';
            throw new Error(errorMessage);
        }
        const stripeProduct = stripeResponse.data;
        const paymentData = {
            payment_id: stripeProduct.id,
            price_id: stripeProduct.default_price,
            paymentCurrency: stripeProductPayload.default_price_data.currency,
            paymentInterval: stripeProductPayload.default_price_data.recurring.interval,
            paymentInterval_count: stripeProductPayload.default_price_data.recurring.interval_count,
            updatedAt: Date.now()
        };
        const enrichedResult = await updateById('plano', plano.id, paymentData, 'id');
        return {success: true, data: enrichedResult};
    } catch (stripeError) {
        console.error(`[STRIPE INTEGRATION ERROR] Integration failed for plano ${plano.id}`, stripeError.message);
        console.log('### Desativando flag de pagamento no plano ###');
        const updatedPlano = await updateById('plano', plano.id, {isPaymentActive: 0, updatedAt: Date.now()}, 'id');
        return {success: false, data: updatedPlano};
    }
}

export async function getPlanos(event) {
    try {
        const queryParams = event.queryStringParameters || {};
        const {
            limit = 50,
            offset = 0,
            status,
            sortBy = 'display_name',
            sortOrder = 'ASC'
        } = queryParams;

        let condition = '';
        const params = [];

        if (status !== undefined) {
            if (!validateFieldValues(status.toLowerCase(), VALID_STATUS)) {
                return createErrorResponse(400, 'INVALID_PARAMETER',
                    'Invalid status value. Valid options: ' + VALID_STATUS.join(', '));
            }
            condition = 'status = ?';
            params.push(status.toLowerCase());
        }

        // Centralized and safe sorting logic
        const validSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'display_name';
        const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';
        const orderClause = `${validSortBy} ${validSortOrder}`;

        const [result, totalCount] = await Promise.all([
            getAll('plano', condition, params, parseInt(limit), parseInt(offset), orderClause),
            getCount('plano', condition, params)
        ]);

        return success({
            data: result,
            pagination: {
                total: totalCount,
                count: result.length,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: (parseInt(offset) + result.length) < totalCount,
            },
            sorting: {
                orderBy: validSortBy,
                sortOrder: validSortOrder
            }
        });
    } catch (error) {
        console.error('GET Plans Error:', error);
        return serverError('Failed to fetch plans');
    }
}

export async function getPlanoById(event) {
    try {
        const id = event.routeParams?.id;
        if (!id) {
            return serverError('ID parameter is required', 400);
        }
        const result = await getById('plano', id, '', 'id');
        if (!result) {
            return notFound('Plano not found');
        }
        return success({data: result});
    } catch (error) {
        console.error('GET Plan By ID Error:', error);
        return serverError('Failed to fetch plan');
    }
}

export async function createPlano(event) {
    try {
        const body = JSON.parse(event.body || '{}');

        const requiredValidation = validateRequiredFields(body, REQUIRED_FIELDS);
        if (!requiredValidation.isValid) {
            return createErrorResponse(400, 'MISSING FIELDS', 'Missing or empty required fields', requiredValidation);
        }

        for (const field of UNIQUE_FIELDS) {
            const query = `SELECT id FROM plano WHERE ${field} = ?`;
            const [existing] = await executeQuery(query, [body[field]]);
            if (existing) {
                return createErrorResponse(409, 'CONFLICT', `Já existe um plano com este '${field}' cadastrado`, {
                    field,
                    value: body[field]
                });
            }
        }

        const data = filterAllowedFields(body, ALLOWED_UPDATE_FIELDS);
        const enrichedData = {
            ...data,
            status: data.status ? data.status.trim().toLowerCase() : 'ativo',
            origem: 'local',
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        const result = await insert('plano', enrichedData);
        if (result) {
            if (result.isPaymentActive === 1) {
                const integration = await _createStripeProductAndUpdatePlano(result);
                if (integration.success) {
                    return success({data: integration.data, message: 'Plano criado e integrado no Stripe...'}, 201);
                } else {
                    return success({
                        data: integration.data,
                        message: 'Plano criado na aplicação mas falhou ao integrar com Stripe'
                    }, 201);
                }
            }
            return success({
                data: result,
                message: 'Novo plano criado! SEM INTEGRAÇÃO COM STRIPE'
            }, 201);
        }
    } catch (error) {
        console.error('CREATE Plan Error:', error);
        return serverError('Failed to create plan');
    }
}

export async function updatePlano(event) {
    try {
        const id = event.routeParams?.id;
        if (!id) {
            return serverError('ID parameter is required', 400);
        }

        const currentPlano = await getById('plano', id, '', 'id');
        if (!currentPlano) {
            return notFound('Plano not found');
        }

        const body = JSON.parse(event.body || '{}');
        const cleanData = filterAllowedFields(body, ALLOWED_UPDATE_FIELDS);

        if (Object.keys(cleanData).length === 0) {
            return createErrorResponse(400, 'BAD_REQUEST', 'No valid fields to update');
        }

        for (const field of UNIQUE_FIELDS) {
            if (cleanData[field]) {
                const query = `SELECT id FROM plano WHERE ${field} = ? AND id <> ?`;
                const [existing] = await executeQuery(query, [cleanData[field], id]);
                if (existing) {
                    return createErrorResponse(409, 'CONFLICT', `Já existe um plano com este '${field}' cadastrado`, {
                        field,
                        value: cleanData[field]
                    });
                }
            }
        }



        if (cleanData.status) {
            cleanData.status = cleanData.status.trim().toLowerCase();
            if (!VALID_STATUS.includes(cleanData.status)) {
                return serverError('Invalid status. Valid options: ' + VALID_STATUS.join(', '), 400);
            }
            // Use the SUSPEND_PAYMENT array to drive the logic
            if (SUSPEND_PAYMENT.includes(cleanData.status)) {
                cleanData.isPaymentActive = 0;
            }
        }

        const dataForDB = { ...currentPlano, ...cleanData, updatedAt: Date.now() };

        if (!dataForDB.payment_id && dataForDB.isPaymentActive) {
             console.log(`\u2699\uFE0F Activating and syncing local plano ${id} with Stripe for the first time...`);
             const integration = await _createStripeProductAndUpdatePlano(dataForDB);
             return success({
                 data: integration.data,
                 message: integration.success ? 'Plano ativado e sincronizado com Stripe!' : 'Plano ativado, mas falhou ao sincronizar com Stripe.'
             }, 200);
        }

        if (dataForDB.payment_id) {
            const stripeProductId = dataForDB.payment_id;
            const oldPriceId = currentPlano.price_id;

            const effectiveIsActive = dataForDB.isPaymentActive === 1;

            const priceChanged = cleanData.valor_atual && (currentPlano.valor_atual !== cleanData.valor_atual);
            if (priceChanged && effectiveIsActive) {
                console.log(`\u2699\uFE0F Price changed for plano ${id}. Updating Stripe...`);
                const newPrice = await createPrice({
                    product: stripeProductId,
                    unit_amount: Math.round(dataForDB.valor_atual * 100),
                    currency: dataForDB.paymentCurrency || 'brl',
                    recurring: {
                        interval: dataForDB.paymentInterval || 'month',
                        interval_count: dataForDB.paymentInterval_count || 1,
                    },
                });
                console.log(`\u2705 New Stripe price ${newPrice.id} created.`);

                await updateProduct(stripeProductId, {default_price: newPrice.id});
                console.log(`\u2705 Product ${stripeProductId} updated with new default price.`);

                if (currentPlano.price_id) {
                    await updatePrice(oldPriceId, {active: false});
                    console.log(`\u2705 Old price ${oldPriceId} deactivated.`);
                }
                dataForDB.price_id = newPrice.id;
            }

            const productPayload = {};
            if (cleanData.nome && currentPlano.nome !== cleanData.nome) productPayload.name = cleanData.nome;
            if (cleanData.descricao && currentPlano.descricao !== cleanData.descricao) productPayload.description = cleanData.descricao;
            if (cleanData.display_name && currentPlano.display_name !== cleanData.display_name) {
                productPayload.metadata = {...productPayload.metadata, display_name: cleanData.display_name};
            }
            productPayload.active = dataForDB.isPaymentActive === 1;

            if (Object.keys(productPayload).length > 0) {
                console.log(`\u2699\uFE0F Syncing metadata changes to Stripe product ${stripeProductId}...`);
                await updateProduct(stripeProductId, productPayload);
                console.log(`\u2705 Stripe product metadata updated.`);
            }
        }

        const finalUpdatedPlano = await updateById('plano', id, dataForDB);

        return success({
            data: finalUpdatedPlano,
            message: 'Plano Atualizado!'
        })

    } catch (error) {
        console.error('UPDATE Plano Error:', error);
        return serverError('Failed to update Plano');
    }
}
