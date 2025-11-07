import Stripe from 'stripe';
import {executeQuery, getById, updateById, insert} from '../../utils/database.js';
import {success, serverError, logInfo, logAlerta} from '../../utils/response.js';

// 1. Declare the variable but do not initialize it.
let stripe;

/**
 *  Lazily initialize and returns the Stripe instance.
 *  @returns {Stripe} The Stripe instance.
 */
function getStripe() {
    if(!stripe) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('Stripe secret key is not configured in environment variables.');
        }
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
}

// #region Product and Price Functions
export async function singleShotCreate(produto) {
    const stripe = getStripe(); // Get instance
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

export async function updateProduct(prodId, payload) {
    const stripe = getStripe(); // Get instance
    return await stripe.products.update(prodId, payload);
}

export async function createPrice(priceData) {
    const stripe = getStripe(); // Get instance
    return await stripe.prices.create({
        product: priceData.product,
        unit_amount: priceData.unit_amount,
        currency: priceData.currency,
        recurring: {
            interval: priceData.recurring.interval,
            interval_count: priceData.recurring.interval_count
        },
    });
}

export async function updatePrice(priceId, payload){
    const stripe = getStripe(); // Get instance
    return await stripe.prices.update(priceId, payload);
}

export async function getStripeProduct(id) {
    const stripe = getStripe(); // Get instance
    try {
        return await stripe.products.retrieve(id, { expand: ['default_price'], });
    } catch (error) {
        if (error.type === 'StripeInvalidRequestError' && error.statusCode === 404) {
            console.error(`Product not found: `, id);
            return null;
        }
        console.error(`[STRIPE] unexpected Error : `, error)
        throw error;
    }
}
// #endregion

// #region Customer and Subscription Functions
export async function createStripeCustomer(assinante) {
    const stripe = getStripe(); // Get instance
    return stripe.customers.create({
        name: assinante.nome,
        email: assinante.email,
        phone: assinante.fone,
        metadata: {
           assinante_id: assinante.id,
        },
    });
}

export async function createStripeSubscription(customerId, priceId) {
    const stripe = getStripe(); // Get instance
    return stripe.subscriptions.create({
        customer: customerId,
        items: [{price: priceId}],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription'},
        expand: ['latest_invoice.payment_intent'],
    });
}
// #endregion

// #region Webhook Handlers

async function handleCustomerEvents(stripeEvent) {
    //const stripe = getStripe(); // Get instance
    const eventType = stripeEvent.type;
    const dataObject = stripeEvent.data.object;

    switch (eventType) {
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
            const subscription = dataObject;
            const localAssinatura = await getById('assinatura', subscription.id, '', 'stripe_subscription_id');

            if (localAssinatura) {
                const isDeleted = eventType === 'customer.subscription.deleted';
                const newStatus = isDeleted ? 'canceled' : subscription.status;

                // Update the assinatura table
                const assinaturaData = {
                    stripe_status: newStatus,
                    current_period_end: subscription.current_period_end ? subscription.current_period_end * 1000 : null,
                    renova_automatico: !subscription.cancel_at_period_end,
                    updatedAt: Date.now(),
                };
                await updateById('assinatura', localAssinatura.id, assinaturaData);
                console.log(`[DB Sync] Updated assinatura ${localAssinatura.id} to status ${newStatus}.`);

                // If the subscription is definitively deleted, update the parent assinante
                if (isDeleted) {
                    await updateById('assinante', localAssinatura.id_assinante, { status: 'inativo', updatedAt: Date.now() });
                    console.log(`[DB Sync] Updated assinante ${localAssinatura.id_assinante} to status 'inativo'.`);
                }
            }
            break;
        }
        case 'customer.created':
        case 'customer.updated':
            logInfo(`[Stripe Webhook] Informational customer event: ${eventType}`);
            break;
        default:
            logAlerta(`[Stripe Webhook] Unhandled customer event type ${eventType}`);
    }
}

async function handleInvoiceEvents(stripeEvent) {
    const stripe = getStripe(); // Get instance
    const eventType = stripeEvent.type;
    const invoice = stripeEvent.data.object;

    switch (eventType) {
        case 'invoice.payment_succeeded': {
            if (!invoice.subscription) break; // Not a subscription invoice

            const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
            const localAssinatura = await getById('assinatura', subscription.id, '', 'stripe_subscription_id');

            if (localAssinatura) {
                // Update the assinatura table
                const assinaturaData = {
                    stripe_status: subscription.status, // Should be 'active'
                    current_period_end: subscription.current_period_end ? subscription.current_period_end * 1000 : null,
                    updatedAt: Date.now(),
                };
                await updateById('assinatura', localAssinatura.id, assinaturaData);
                console.log(`[DB Sync] Updated assinatura ${localAssinatura.id} to status ${subscription.status}.`);

                // Update the related assinante table
                await updateById('assinante', localAssinatura.id_assinante, { status: 'ativo', updatedAt: Date.now() });
                console.log(`[DB Sync] Updated assinante ${localAssinatura.id_assinante} to status 'ativo'.`);
            }
            break;
        }
        case 'invoice.created':
        case 'invoice.paid':
        case 'invoice.updated':
        case 'invoice.finalized':
            logInfo(`[Stripe Webhook] Informational invoice event: ${eventType}`);
            break;
        default:
            logAlerta(`[Stripe Webhook] Unhandled invoice event type ${eventType}`);
    }
}

async function handlePaymentEvents(stripeEvent) {
    //const stripe = getStripe(); // Get instance
    logInfo(`[Stripe Webhook] Informational payment event: ${stripeEvent.type}`);
}

async function handleProductEvents(stripeEvent) {
    //const stripe = getStripe(); // Get instance
    // when a product is created directly in Stripe dashboard multiple events are fired

    // console.log('[stripe event para product/price \n', stripeEvent);
    if (stripeEvent.type === 'product.created' || stripeEvent.type === 'product.updated') {
        logInfo('[STRIPE PRODUCT CREATED/UPDATED] Information log' )
    }
    if (stripeEvent.type === 'price.created') {
        console.log('*** inside price.created ***')
        const price = stripeEvent.data.object;
        let productData = {
            price_id: price.id,
            payment_id: price.product,
            valor_atual: price.unit_amount/100,
            isPaymentActive: price.active,
            status: price.active ? 'ativo' : 'inativo',
            paymentCurrency: price.currency,
            paymentInterval: price.recurring.interval,
            paymentInterval_count: price.recurring.interval_count
        }
        console.log('productData para select');
        const localPlano = await executeQuery(`SELECT * FROM plano WHERE payment_id = ?`, [price.product]);
        console.log('localPlano', localPlano);
        // se plano foi criado pelo dashboard do stripe replica no app
        if (localPlano.length === 0) {
            console.log('plano não localizado, tentando criar... ');
            const stripeProduct = await getStripeProduct(price.product);
            productData = {...productData,
                nome: stripeProduct.name,
                display_name: stripeProduct.metadata.display_name ? stripeProduct.metadata.display_name : stripeProduct.name,
                descricao: stripeProduct.description,
                origem: 'stripe',
                obs: 'CRIADO PELO DASHBOARD DO STRIPE',
                createdAt: Date.now(),
                updatedAt: Date.now()
            }
            try {
                await insert('plano', productData);
                console.log('[STRIPE INTEGRATION SUCCESS]');
            } catch (err) {
                console.log(`[STRIPE INTEGRATION FAILED : ${err.message}`);
            }
        }
    }
}

export async function webhook(event) {
    const stripe = getStripe(); // Get instance
    // 1. SECURELY PARSE THE EVENT
    const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let stripeEvent;

    try {
        stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed.`, err.message);
        return serverError(`Webhook Error: ${err.message}`, 400);
    }

    // 2. ROUTE THE VERIFIED EVENT TO THE CORRECT HANDLER
    console.log(`[Stripe Webhook handler] Received event: ${stripeEvent.type}`);

    try {
        if (stripeEvent.type.startsWith('customer.')) {
            await handleCustomerEvents(stripeEvent);
        } else if (stripeEvent.type.startsWith('invoice.')) {
            await handleInvoiceEvents(stripeEvent);
        } else if (stripeEvent.type.startsWith('payment_intent.')) {
            await handlePaymentEvents(stripeEvent);
        } else if (stripeEvent.type.startsWith('product.') || stripeEvent.type.startsWith('price.')) {
            await handleProductEvents(stripeEvent);
        } else {
            console.log(`[Stripe Webhook] Unhandled event category: ${stripeEvent.type}`);
        }
    } catch (dbError) {
        console.error('[DB Sync] Error handling webhook event:', dbError);
    }

    return success({ received: true });
}

// #endregion

// #region Mock/Test Functions (Not for production use)
export async function listStripeProducts(event) {
    const body = JSON.parse(event.body);
    console.log(body)

    const produtos = await stripe.products.list();
    return success({
        data: produtos,
    });
}

export async function checkout(event) {
    const body = JSON.parse(event.body);
    //const plano_id = body.smartPlano_id;
    //const product_id = body.plano_stripeID;
    const price_id = body.priceId;
    const sessionMode = body.session_mode;
    const paymentType = body.payment_type;

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
}
// #endregion