import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import { success, serverError } from '../../utils/response.js';

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

    const body = JSON.parse(event.body);

    //Handle stripe events
    switch (body.type) {
        case 'payment_intent.created':
        { const paymentIntent = body.data.object;
            console.log('Stripe Payment Intent created');
            console.log(paymentIntent);
            break;
        }
        case 'payment_intent.succeeded':
            { const paymentIntent = body.data.object;
            console.log (`Stripe Payment Intent for ${paymentIntent.amount} was successful!'`);
            break; }
        case 'payment_method.attached':
            { const paymentMethod = event.data.object;
            console.log(`Stripe payment method ${paymentMethod}`);
            break; }
        case 'invoice_payment.failed':
            console.log('Stripe invoice payment failed');
            break;
        case 'product.created':
            console.log('Stripe product created *** IF CREATION DIRECTLY IN STRIPE IMPLEMENT HANDLE ***\n', body.data.object);
            // in case a product is created direclty in stripe object should
            // be used to create local instance of product in app DB
            break;
        case 'product.updated':
            console.log('Stripe product updated *** TO BE IMPLEMENTED *** \n', body.data.object);
            // in case product is updated in stripe returned object should
            // be used to update app DB data
            break;
        default:
            console.log(new Date().toLocaleString(), `Unhandled event type ${body.type}`);
    }
    return success();
}