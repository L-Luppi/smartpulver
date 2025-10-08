import Stripe from 'stripe';
import { getById, updateById } from '../../utils/database.js';
import { success, serverError } from '../../utils/response.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function singleShotCreate(produto) {
    try {
        const stripeProd = await stripe.products.create({
            name: produto.name,
            description: produto.description,
            default_price_data: {
                currency: produto.default_price_data.currency ? produto.default_price_data.currency : 'brl',
                unit_amount: produto.default_price_data.unit_amount,
                recurring: {
                    interval: produto.default_price_data.recurring?.interval ?
                        produto.default_price_data.recurring?.interval : 'month',
                    interval_count: produto.default_price_data.recurring?.interval_count ?
                        produto.default_price_data.recurring?.interval_count : 1,
                },
            },
            metadata: produto.metadata,
            expand: ['default_price'],
        });
        return success(stripeProd, 200);
    }catch(error){
        console.error('CREATE Product Error:', error);
        return serverError('SINGLESHOT CREATE - Failed to create product');
    }
}

// ESSE METODO VAI FICAR EM STANDBY ... usar o metodo acima
// singleShotCreate CRIA PRODUTO E PREÇO NO NOVO PADRÃO DA API
export async function createProduct(produto) {
    console.log('STRIPE produto \n', produto)
    try {
        // EXTRAI APENAS DADOS DO PRODUTO
        const stripeProd = await stripe.products.create({
            name: produto.name,
            description: produto.description,
            metadata: produto.metadata
        });

        const stripePrice = await stripe.prices.create({
            unit_amount: produto.default_price_data.unit_amount,   // em centavos 10000 = 100.00
            currency: produto.default_price_data.currency,         //paymentCurrency,   // 'brl',
            recurring: {
                interval: produto.default_price_data.recurring.interval,
                interval_count: produto.default_price_data.recurring.interval_count
            },
            product: stripeProd.id
        });
        return {stripeProd, stripePrice}
    } catch (error) {
        console.error('CREATE Product Error:', error);
        return serverError('Failed to create product');
    }
}

export async function updateProduct(prodId, payload) {
    return await stripe.products.update(prodId, payload);
}

/**
 * Creates a new customer in Stripe
 * @param {object} assinante - the subscriber object from app
 * @returns {Promise<object>} - Stripe customer object
 */

export async function createStripeCustomer(assinante) {
    return stripe.customers.create({
        name: assinante.nome,
        email: assinante.email,
        phone: assinante.fone,
        metadata: {
           assinante_id: assinante.id,
        },
    });
}

/**
 * Creates a new subscription in Stripe
 * @param {string} customerId - Stripe customer ID
 * @param {string} priceId - Stripe price ID
 * @returns {Promise<object>} The created Stripe subscription object
 */
export async function createStripeSubscription(customerId, priceId) {
    return stripe.subscriptions.create({
        customer: customerId,
        items: [{price: priceId}],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription'},
        expand: ['latest_invoice.payment_intent'],
    });
}
// PRICES

export async function createPrice(priceData) {

    return await stripe.prices.create({
        unit_amount: priceData.unit_amount,   // em centavos 10000 = 100.00
        currency: priceData.currency,         //paymentCurrency,   // 'brl',
        recurring: {
            interval: priceData.recurring.interval,
            interval_count: priceData.recurring.interval_count
        },
        product: priceData.product_id
    });
}

export async function updatePrice(priceId, payload){
    return await stripe.prices.update(priceId, payload);
}

export async function listStripeProducts(event) {
    const body = JSON.parse(event.body);
    console.log(body)

    const produtos = await stripe.products.list();
    return success({
        data: produtos,
    });
}

export async function getStripeProduct(id) {
    try {
        return await stripe.products.retrieve(id, { expand: ['default_price'], });
    } catch (error) {
        if (error.type === 'StripeInvalidRequestError' && error.statusCode === 404) {
            console.error('[STRIPE] Product not found: ', id);
            return null;
        }
        console.error('[STRIPE] unexpected Error : ', error)
        throw error;
    }
}

export async function checkout(event) {
    const body = JSON.parse(event.body);
    const plano_id = body.smartPlano_id;          // nosso ID
    const product_id = body.plano_stripeID;       // ID do produto no Stripe
    const price_id = body.priceId;                // Stripe PriceID
    const sessionMode = body.session_mode;            // payment, setup, subscription
    const paymentType = body.payment_type;


//    const session = await stripe.checkout.sessions.create({
    // try {
    console.log(plano_id, product_id, price_id, sessionMode, paymentType);
    const mock_session = ({
        mode: sessionMode,
        payment_method_types: paymentType,
        line_items: [{price: price_id, quantity: 1}],
        success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOU_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/princing`,
    });
    return success({
        data: mock_session,
    });
    //} catch (error) {
    //
    //}
}

export async function webhook(event) {
    // 1. SECURELY PARSE THE EVENT
    // This is the part you will implement. It's critical for security.
    const sig = event.headers['stripe-signature']; // Use lowercase header name
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let stripeEvent;

    try {
        // Use the Stripe library to safely construct the event
        stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed.`, err.message);
        return serverError(`Webhook Error: ${err.message}`, 400);
    }

    // 2. HANDLE THE VERIFIED EVENT
    console.log(`[Stripe Webhook] Received event: ${stripeEvent.type}`);

    try {
        switch (stripeEvent.type) {
            // A payment for a subscription succeeded (either the first payment or a renewal).
            case 'invoice.payment_succeeded': {
                const invoice = stripeEvent.data.object;
                // The subscription object is available on the invoice
                const subscription = await stripe.subscriptions.retrieve(invoice.subscription);

                const localAssinatura = await getById('assinatura', subscription.id, '', 'stripe_subscription_id');

                if (localAssinatura) {
                    const dataToUpdate = {
                        stripe_status: subscription.status, // Should be 'active'
                        current_period_end: subscription.current_period_end * 1000, // Convert to ms
                        updatedAt: Date.now(),
                    };
                    await updateById('assinatura', localAssinatura.id, dataToUpdate);
                    console.log(`[DB Sync] Updated assinatura ${localAssinatura.id} to status ${subscription.status}.`);
                } else {
                    console.warn(`[DB Sync] Received 'invoice.payment_succeeded' for unknown subscription ${subscription.id}.`);
                }
                break;
            }

            // A subscription has been updated (e.g., user cancels, trial ends).
            case 'customer.subscription.updated': {
                const subscription = stripeEvent.data.object;
                const localAssinatura = await getById('assinatura', subscription.id, '', 'stripe_subscription_id');

                if (localAssinatura) {
                    const dataToUpdate = {
                        stripe_status: subscription.status,
                        current_period_end: subscription.current_period_end * 1000, // Convert to ms
                        renova_automatico: !subscription.cancel_at_period_end, // if they cancel, renova_automatico becomes false
                        updatedAt: Date.now(),
                    };
                    await updateById('assinatura', localAssinatura.id, dataToUpdate);
                    console.log(`[DB Sync] Updated assinatura ${localAssinatura.id} due to 'customer.subscription.updated'.`);
                } else {
                    console.warn(`[DB Sync] Received 'customer.subscription.updated' for unknown subscription ${subscription.id}.`);
                }
                break;
            }

            // A subscription has been definitively deleted.
            case 'customer.subscription.deleted': {
                const subscription = stripeEvent.data.object;
                const localAssinatura = await getById('assinatura', subscription.id, '', 'stripe_subscription_id');

                if (localAssinatura) {
                    const dataToUpdate = {
                        stripe_status: 'canceled', // Or your preferred final status
                        updatedAt: Date.now(),
                    };
                    await updateById('assinatura', localAssinatura.id, dataToUpdate);
                    console.log(`[DB Sync] Canceled assinatura ${localAssinatura.id} due to 'customer.subscription.deleted'.`);
                } else {
                    console.warn(`[DB Sync] Received 'customer.subscription.deleted' for unknown subscription ${subscription.id}.`);
                }
                break;
            }

            default:
                console.log(`Unhandled event type ${stripeEvent.type}`);
        }
    } catch (dbError) {
        console.error('[DB Sync] Error handling webhook event:', dbError);
        // We return a 200 to Stripe to prevent retries for a database issue,
        // but we log the error for internal monitoring.
    }

    // Return a 200 response to acknowledge receipt of the event
    return success({ received: true });
}
