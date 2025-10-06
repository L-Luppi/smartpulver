import {getAll, getById, insert, updateById, getCount, executeQuery} from '../../utils/database.js';
import {success, notFound, serverError} from '../../utils/response.js';
import {getStripeProduct, updateProduct, updatePrice, createPrice, singleShotCreate} from '../stripe/stripe.js';

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
    'paymentInterval_count', 'paymentCurrency', 'status'];
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
                display_name: plano.display_name
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
            orderBy = 'display_name',
            sortBy = 'display_name',
            sortOrder = 'ASC'
        } = queryParams;

        let condition = '';
        const params = [];

        if (status !== undefined) {
            if (VALID_STATUS.includes(status.toLowerCase())) {
                condition = 'status = ?';
                params.push(status.toLowerCase());
            } else {
                return serverError('Invalid Status', 400);
            }
        }

        let orderClause = orderBy;
        if (sortBy) {
            const allowedSortFields = ['id', 'nome', 'display_name', 'valor_atual', 'updatedAt', 'createdAt'];
            const allowedSortOrder = ['ASC', 'DESC'];

            if (allowedSortFields.includes(sortBy) && allowedSortOrder.includes(sortOrder.toUpperCase())) {
                orderClause = `${sortBy} ${sortOrder.toUpperCase()}`;
            }
        }

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
                orderBy: orderClause
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

        if (cleanData.status !== undefined) {
            cleanData.status = cleanData.status.trim().toLowerCase();
            if (!validateFieldValues(cleanData.status, VALID_STATUS)) {
                return serverError('Invalid status.  Valid options: ' + VALID_STATUS.join(', '), 400);
            }
            if (SUSPEND_PAYMENT.includes(cleanData.status)) {
                cleanData.isPaymentActive = 0;
            }
        }
        const enrichedData = {...cleanData, updatedAt: Date.now()};
        let updatedPlano = await updateById('plano', id, enrichedData, 'id');

        if (updatedPlano) {
            const paymentId = updatedPlano.payment_id;
            const priceId = updatedPlano.price_id;

            if (!paymentId && updatedPlano.isPaymentActive) {
                const integration = await _createStripeProductAndUpdatePlano(updatedPlano);
                if (integration.success) {
                    return success({data: integration.data, message: 'Plano Atualizado e integrado no Stripe...'}, 200);
                } else {
                    return success({
                        data: integration.data,
                        message: 'Plano Atualizado na aplicação mas falhou ao integrar com Stripe'
                    }, 200);
                }
            }

            if (paymentId) {
                const currentStripeData = await getStripeProduct(paymentId);

                if (!currentStripeData) {
                    console.log(`Produto Stripe com ID ${paymentId} não encontrado. Tentando recriar...`);
                    if (updatedPlano.isPaymentActive) {
                        const integration = await _createStripeProductAndUpdatePlano(updatedPlano);
                        if (integration.success) {
                            return success({
                                data: integration.data,
                                message: 'Plano Atualizado e integração com Stripe recriada.'
                            }, 200);
                        } else {
                            return serverError('Produto não encontrado no Stripe. Falha ao recriar a integração. O plano foi desativado para pagamentos.', 500);
                        }
                    }
                } else {
                    const stripePayload = {};
                    if (updatedPlano.nome && currentStripeData.name !== updatedPlano.nome) stripePayload.name = updatedPlano.nome;
                    if (updatedPlano.descricao !== undefined && currentStripeData.description !== updatedPlano.descricao) stripePayload.description = updatedPlano.descricao;
                    if (updatedPlano.display_name !== undefined && currentStripeData.metadata?.display_name !== updatedPlano.display_name) stripePayload.metadata = {
                        ...currentStripeData.metadata,
                        display_name: updatedPlano.display_name
                    };

                    const isActive = ['ativo', 'promo'].includes(updatedPlano.status.toLowerCase());
                    const effectiveIsActive = isActive && updatedPlano.isPaymentActive === 1;
                    if (currentStripeData.active !== effectiveIsActive) {
                        stripePayload.active = effectiveIsActive;
                    }

                    if (Object.keys(stripePayload).length > 0) {
                        console.log(`[STRIPE] Updating product ${paymentId} with payload: `, stripePayload);
                        await updateProduct(paymentId, stripePayload);
                    }

                    const priceChanged = (currentPlano.valor_atual !== updatedPlano.valor_atual) ||
                        (currentPlano.paymentInterval !== updatedPlano.paymentInterval) ||
                        (currentPlano.paymentInterval_count !== updatedPlano.paymentInterval_count) ||
                        (currentPlano.paymentCurrency !== updatedPlano.paymentCurrency);

                    if (priceChanged && effectiveIsActive) {
                        const newPricePayload = {
                            unit_amount: Math.round(updatedPlano.valor_atual * 100),
                            currency: updatedPlano.paymentCurrency,
                            recurring: {
                                interval: updatedPlano.paymentInterval,
                                interval_count: updatedPlano.paymentInterval_count,
                            },
                            product: paymentId
                        };
                        if (priceId) await updatePrice(priceId, {active: false});
                        const newPrice = await createPrice(newPricePayload);
                        updatedPlano = await updateById('plano', id, {
                            price_id: newPrice.id,
                            updatedAt: Date.now()
                        }, 'id');
                    }
                }
            }

            return success({
                data: updatedPlano,
                message: 'Plano Atualizado!'
            });
        }
    } catch (error) {
        console.error('UPDATE Plano Error:', error);
        return serverError('Failed to update Plano');
    }
}
