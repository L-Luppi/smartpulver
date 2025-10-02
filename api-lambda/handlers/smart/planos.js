const { getAll, getById, insert, updateById, getCount, executeQuery} = require('../../utils/database');
const { success, notFound, serverError } = require('../../utils/response');
const { createProduct, getStripeProduct, updateProduct, updatePrice, createPrice} = require('../stripe/stripe');

const {
    validateRequiredFields,
    filterAllowedFields,
    createErrorResponse,
    validateFieldValues
} = require('../../utils/dataValidation');

const REQUIRED_FIELDS = ['nome', 'display_name', 'isPaymentActive', 'valor_atual'];
const UNIQUE_FIELDS = ['nome', 'display_name'];
const ALLOWED_UPDATE_FIELDS = ['nome', 'display_name', 'descricao',
    'duracao_dias', 'valor_atual', 'isPaymentActive', 'paymentInterval',
    'paymentInterval_count', 'paymentCurrency', 'status'];
const VALID_STATUS = ['ativo', 'inativo', 'cancelado', 'promo', 'suspenso'];
const SUSPEND_PAYMENT = ['inativo', 'cancelado', 'suspenso']

// GET /api/v1/smart/plans
async function getPlanos(event) {
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
            const validStatus = ['ativo', 'inativo', 'cancelado', 'promo', 'suspenso'];
            if (validStatus.includes(status.toLowerCase())) {
                condition = 'status = ?';
                params.push(status.toLowerCase());
            } else {
                return serverError('Invalid Status', 400);
            }
        }

        let orderClause = orderBy;
        if (sortBy) {
            const allowedSortFields = ['id', 'nome', 'display_name', 'valor_atual', 'updatedAt', 'createdAt' ];
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

// GET /api/v1/smart/plans/{id}
async function getPlanoById(event) {

    try {
        const id = event.routeParams?.id;
        if (!id) {
            return serverError('ID parameter is required', 400);
        }

        const result = await getById('plano', id, '', 'id');

        if (!result) {
            return notFound('Plano not found');
        }

        return success({ data: result });

    } catch (error) {
        console.error('GET Plan By ID Error:', error);
        return serverError('Failed to fetch plan');
    }
}

// POST /api/v1/smart/plans
async function createPlano(event) {
    try {
        const body = JSON.parse(event.body || '{}');

        // Validate required fields
        const requiredValidation = validateRequiredFields(body, REQUIRED_FIELDS);
        if (!requiredValidation.isValid) {
            return createErrorResponse(400,'MISSING FIELDS','Missing or empty required fields', requiredValidation);
        }

        for (const field of UNIQUE_FIELDS) {
            const query = `SELECT id FROM plano WHERE ${field} = ?`;
            const [existing] = await executeQuery(query, [body[field]]);
            if (existing) {
                return createErrorResponse(409, 'CONFLICT', `Já existe um plano com este '${field}' cadastrado`, {field, value: body[field]});
            }
        }

        const data = {};
        ALLOWED_UPDATE_FIELDS.forEach(field => {
            if (body[field] !== undefined) {
                data[field] = body[field];
            }
        });

        // Set defaults
        if (data.createdAt === undefined) data.createdAt = Date.now();
        if (data.updatedAt === undefined) data.updatedAt = Date.now();
        if (data.status === undefined) data.status = 'ativo';

        const result = await insert('plano', data);
        if (result) {
            // VERIFICA SE VEIO COM FLAG PARA CRIAR PRODUTO NO STRIPE
            if (result.isPaymentActive === 1) {
                try {
                    console.log('flag para stripe veio ativa... tentando criar plano no stripe')
                    const stripeProduct = {
                        name: result.nome,
                        description: result.descricao,
                        metadata: {
                            internal_id: result.id,
                            display_name: result.display_name
                        },
                        default_price_data: {
                            unit_amount: Math.round(result.valor_atual * 100),
                            currency: result.paymentCurrency,   // 'brl',
                            recurring: {
                                interval: result.paymentInterval,
                                interval_count: result.paymentInterval_count
                            }
                        }
                    };
                    //console.log("### CALLING STRIPE WITH\n", stripeProduct);
                    const paymentResource = await createProduct(stripeProduct);
                    //console.log("### STRIPE RETURN \n", paymentResource);
                    // call updatePlano
                    const paymentData = {
                        payment_id: paymentResource.stripeProd.id,
                        price_id: paymentResource.stripePrice.id
                    }
                    // update plano with selling partner id and price id
                    const enrichedResult = await updateById('plano', result.id, paymentData, 'id');
                    return success({
                        data: enrichedResult,
                        message: 'Plano Criado e integrado no Stripe...'
                    }, 201);
                } catch (stripeError) {
                    console.error(' ### STRIPE INTEGRATION FAILED: ', stripeError.message);
                    // if integration fails update local record to reflect failure.
                    await updateById('plano', result.id, { isPaymentActive : 0, updatedAt: Date.now() }, 'id');
                    return success({
                        data: result,   // original result from planoCreate
                        message: 'Plano Criado na aplicação mas falhou ao integrar com Stripe'
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

async function updatePlano(event) {
    try {
        //const id = event.pathParameters?.pathParameters?.id;  // Make sure this matches your route
        const id = event.routeParams?.id;
        if (!id) {
            return serverError('ID parameter is required', 400);
        }

        // BEFORE UPDATING GET CURRENT DATA TO COMPARE CHANGES
        const currentPlano = await getById('plano', id, '', 'id');
        if (!currentPlano) {
            return notFound('Plano not found');
        }

        // If plano exists validate and handle updates
        const body = JSON.parse(event.body || '{}');

        // Filter incoming data to only allow updatable fields
        const cleanData = filterAllowedFields(body, ALLOWED_UPDATE_FIELDS);

        if (Object.keys(cleanData).length === 0){
            return createErrorResponse(400, 'BAD_REQUEST', 'No valid fields to update');
        }

        // VALIDATE UNIQUENESS OF FIELDS BEING UPDATED
        // AVOID DB DUPLICATE RECORDS ERRORS
        for (const field of UNIQUE_FIELDS) {
            if (cleanData[field]) {
                const query = `SELECT id FROM plano WHERE ${field} = ? AND id <> ?`;
                const [existing] = await executeQuery(query, [cleanData[field], id]);
                if (existing) {
                    return createErrorResponse(409, 'CONFLICT', `Já existe um plano com este '${field}' cadastrado`, {field, value: cleanData[field]});
                }
            }
        }

        // Special validation for status field
        if (cleanData.status !== undefined) {
            cleanData.status = cleanData.status.trim().toLowerCase();
            const validStatus = validateFieldValues(cleanData.status, VALID_STATUS)

            if (!validStatus) {
                return serverError('Invalid status. Valid options: ' + validStatus.join(', '), 400);
            }

            if (SUSPEND_PAYMENT.includes(cleanData.status)) {
                cleanData.isPaymentActive = 0;
            }
        }

        const updatedPlano = await updateById('plano', id, cleanData, 'id');

        // stripe sync data
        if (updatedPlano) {
            // check if plano was already synced with stripe payment_id exists
            const paymentId = updatedPlano.payment_id;
            const priceId = updatedPlano.price_id;
            if (paymentId) {
                //// *** try catch ***
                const currentStripeData = await getStripeProduct(paymentId);

                const stripePayload = {}
                let priceChanged = false;

                //compare changes to product data to update
                if (currentStripeData.name !== updatedPlano.nome) {
                    stripePayload.name = updatedPlano.nome;
                }
                if (currentStripeData.description !== updatedPlano.descricao) {
                    stripePayload.description = updatedPlano.descricao;
                }
                if (currentStripeData.metadata.display_name !== updatedPlano.metadata.display_name) {
                    stripePayload.metadata.display_name = updatedPlano.metadata.display_name;
                }
                // update status if needed
                const isActive = ['ativo', 'promo'].includes(updatedPlano.status.toLowerCase());
                const wasActive = currentStripeData.status;

                if (isActive !== wasActive) {
                    stripePayload.active = isActive;
                }

                // UPDATE STRIPES PRODUCT
                if (Object.keys(stripePayload).length > 0) {
                    console.log(`[STRIPE] Updating product ${paymentId} with payload: `, stripePayload);
                    await updateProduct(paymentId, stripePayload);
                }

                // IF THERE WERE CHANGES IN valor_total, paymentInterval, paymentInterval_count or paymentCurrency
                // INACTIVATE CURRENT STRIPE PRICE AND CREATE A NEW ONE
                if ((currentPlano.valor_atual !== updatedPlano.valor_atual) ||
                    (currentPlano.paymentInterval !== updatedPlano.paymentInterval) ||
                    (currentPlano.paymentInterval_count !== updatedPlano.paymentInterval_count) ||
                    (currentPlano.paymentCurrency !== updatedPlano.paymentCurrency)) {
                    priceChanged = true;
                }

                if (priceChanged) {
                    const newPricePayload = {
                        unit_amount: updatedPlano.valor_atual ? updatedPlano.valor_atual : currentPlano.valor_atual,
                        currency: updatedPlano.currency ? updatedPlano.currency : currentPlano.currency,
                        recurring: {
                            interval: updatedPlano.paymentInterval ? updatedPlano.paymentInterval : currentPlano.paymentInterval,
                            interval_count: updatedPlano.paymentInterval_count ? updatedPlano.paymentInterval_count : currentPlano.paymentInterval_count
                        },
                        product: paymentId
                    }

                    // Inactivate old price
                    if (priceId) {
                        await updatePrice(priceId, {active: false})
                    }

                    // Create new price and bind to product
                    const newPrice = await createPrice(newPricePayload)
                    // update plano with new payment id
                    await updateById('plano', id, {price_id: newPrice.id}, 'id');
                }
            } else if (updatedPlano.isPaymentActive) {
                // create payment product
                const stripeProduct = {
                    name: updatedPlano.nome,
                    description: updatedPlano.descricao,
                    metadata: {
                        internal_id: updatedPlano.id,
                        display_name: updatedPlano.display_name
                    },
                    default_price_data: {
                        unit_amount: Math.round(updatedPlano.valor_atual * 100),
                        currency: updatedPlano.paymentCurrency,   // 'brl',
                        recurring: {
                            interval: updatedPlano.paymentInterval,
                            interval_count: updatedPlano.paymentInterval_count
                        }
                    }
                };
                const paymentResource = await createProduct(stripeProduct);
                const paymentData = {
                    payment_id: paymentResource.stripeProd.id,
                    price_id: paymentResource.stripePrice.id
                }
                const enrichedResult = await updateById('plano', updatedPlano.id, paymentData, 'id');
                return success({
                    data: enrichedResult,
                    message: 'Plano Atualizado e integrado no Stripe...'
                }, 201);
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

module.exports = {
    getPlanos,
    getPlanoById,
    createPlano,
    updatePlano
};
