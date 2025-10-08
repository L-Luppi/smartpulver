import { getAll, getById, insert, updateById, getCount, executeQuery } from '../../utils/database.js';
import { success, notFound, serverError, createErrorResponse } from '../../utils/response.js';
import { createStripeCustomer, createStripeSubscription } from '../stripe/stripe.js';

export async function getAssinaturas(event) {
    try {
        const queryParams = event.queryStringParameters || {};
        const { limit = 50,
            offset = 0,
            id_assinante,
            id_plano,
            status
        } = queryParams;

        // Build condition for simple filtering on assinaturas table
        let condition = '';
        const params = [];
        const conditions = [];

        if (id_assinante) {
            conditions.push('id_assinante = ?');
            params.push(id_assinante);
        }

        if (id_plano) {
            conditions.push('id_plano = ?');
            params.push(id_plano);
        }

        if (status) {
            conditions.push('status = ?');
            params.push(status);
        }

        if (conditions.length > 0) {
            condition = conditions.join(' AND ');
        }

        // Get basic subscription data using standard getAll
        const result = await getAll('assinatura', condition, params, parseInt(limit), parseInt(offset), 'createdAt DESC');
        const totalCount = await getCount('assinatura', condition, params);

        return success({
            data: result,
            pagination: {
                total: totalCount,
                count: result.length,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: (parseInt(offset) + result.length) < totalCount
            }
        });

    } catch (error) {
        console.error('GET Subscriptions Error:', error);
        return serverError('Failed to fetch subscriptions');
    }
}

// GET /api/v1/smart/subscriptions/{id} - Enhanced with JOIN data
export async function getAssinaturaById(event) {
    try {
        const id = event.pathParameters?.id;
        if (!id) {
            return serverError('ID parameter is required', 400);
        }

        // Use custom query for detailed view with JOINs
        const query = `
            SELECT 
                a.*,
                p.nome as plano_plano,
                p.display_name as plano_display,
                p.descricao as plano_descricao,
                p.duracao_dias as plano_duracao,
                p.valor_atual as plano_valor,
                p.createdAt as plano_criado_em,
                p.updatedAt as plano_atualizado_em,
                p.status as plano_status,
                s.nome as assinante_nome,
                s.username as assinante_username,
                s.email as assinante_email,
                s.fone as assinante_fone,
                s.cpf_cnpj as assinante_cpf_cnpj,
                s.status as assinante_status, 
                s.cognito_sub as assinante_cognito_sub
            FROM assinatura a
            LEFT JOIN plano p ON a.id_plano = p.id
            LEFT JOIN assinante s ON a.id_assinante = s.id
            WHERE a.id = ?
        `;

        const result = await executeQuery(query, [id]);

        if (result.length === 0) {
            return notFound('Assinatura not found');
        }

        return success({ data: result[0] });

    } catch (error) {
        console.error('GET Subscription By ID Error:', error);
        return serverError('Failed to fetch subscription');
    }
}

export async function createAssinatura(event) {
    try {
        const body = JSON.parse(event.body || '{}');
        const { id_assinante, id_plano } = body;

        if (!id_assinante || !id_plano) {
            return createErrorResponse(400, 'MISSING_PARAMETERS', 'id_assinante and id_plano are required.');
        }

        const assinante = await getById('assinante', id_assinante);
        if (!assinante) {
            return notFound('Assinante');
        }

        const plano = await getById('plano', id_plano);
        if (!plano) {
            return notFound('Plano');
        }

        if (!plano.price_id) {
            return createErrorResponse(400, 'PLAN_NOT_BILLABLE', 'Plano selected is not configured for payment. Missing Stripe Price ID.');
        }

        // Step 1: Find or Create a Stripe Customer
        let customerId = assinante.stripe_customer_id;
        if (!customerId) {
            console.log(`Stripe customer not found for assinante ${assinante.id}. Creating new customer...`);
            const customer = await createStripeCustomer(assinante);
            customerId = customer.id;
            // Save the new customer ID to the local assinante record
            await updateById('assinante', assinante.id, { stripe_customer_id: customerId, updatedAt: Date.now() });
            console.log(`New Stripe customer ${customerId} created and saved.`);
        }

        // Step 2: Create the Stripe Subscription
        console.log(`Creating Stripe subscription for customer ${customerId} with price ${plano.price_id}`);
        const subscription = await createStripeSubscription(customerId, plano.price_id);

        // Step 3: Create the local assinatura record
        const now = Date.now();

        const newAssinaturaData = {
            id_assinante: assinante.id,
            id_plano: plano.id,
            stripe_subscription_id: subscription.id,
            stripe_price_id: plano.price_id,
            stripe_status: subscription.status, // The source of truth for the subscription status
            // Handle null current_period_end for incomplete subscriptions
            current_period_end: subscription.current_period_end ? subscription.current_period_end * 1000 : null,
            valor_pago: plano.valor_atual,
            renova_automatico: body.renova_automatico !== undefined ? body.renova_automatico : true,
            createdAt: now,
            updatedAt: now,
        };

        const localAssinatura = await insert('assinatura', newAssinaturaData);

        // Step 4: Return the client secret IF payment is required
        const clientSecret = subscription.latest_invoice?.payment_intent?.client_secret;

        if (clientSecret) {
            return success({
                message: 'Subscription initiated! Please confirm payment.',
                requiresAction: true,
                assinatura: localAssinatura,
                clientSecret: clientSecret,
            }, 201);
        } else {
            return success({
                message: 'Subscription created successfully! No immediate payment required.',
                requiresAction: false,
                assinatura: localAssinatura,
            }, 201);
        }

    } catch (error) {
        console.error('CREATE Subscription Error:', error);
        if (error.type === 'StripeCardError') {
            return createErrorResponse(400, 'STRIPE_CARD_ERROR', error.message);
        }
        return serverError('Failed to create subscription');
    }
}

// PUT /api/v1/smart/subscriptions/{id}
export async function updateAssinatura(event) {
    try {
        console.log('UPDATE Subscription - Event:', JSON.stringify(event, null, 2));

        const id = event.pathParameters?.id;
        if (!id) {
            return serverError('ID parameter is required', 400);
        }

        const body = JSON.parse(event.body || '{}');

        // Prepare data
        const allowedFields = ['id_plano', 'id_assinante', 'current_period_end', 'renova_automatico', 'valor_pago','stripe_status'];
        const data = {};

        allowedFields.forEach(field => {
            if (body[field] !== undefined) {
                data[field] = body[field];
            }
        });

        if (Object.keys(data).length === 0) {
            return serverError('No valid fields to update', 400);
        }

        const result = await updateById('assinatura', id, data);

        if (!result) {
            return notFound('Assinatura not found');
        }

        return success({
            data: result,
            message: 'Assinatura updated successfully'
        });

    } catch (error) {
        console.error('UPDATE Subscription Error:', error);
        return serverError('Failed to update subscription');
    }
}