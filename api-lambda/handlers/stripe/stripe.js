require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { success, serverError } = require('../../utils/response');

// ESSE METODO VAI FICAR EM STANDBY ... usar createSubscription ao inves dele
async function createProduct(produto) {
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

async function updateProduct(prodId, payload) {
    return await stripe.products.update(prodId, payload);
}

// PRICES

async function createPrice(priceData) {

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

async function updatePrice(priceId, payload){
    return await stripe.prices.update(priceId, payload);
}

async function listStripeProducts(event) {
    const body = JSON.parse(event.body);
    console.log(body)

    const produtos = await stripe.products.list();
    return success({
        data: produtos,
    });
}

async function getStripeProduct(id) {
    return await stripe.products.retrieve(id)
}

async function checkout(event) {
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

async function webhook(event) {

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
            console.log('Stripe product created\n', body.data.object)
            break;
        default:
            console.log(`Unhandled event type ${body.type}`);
    }
    return success();
}


module.exports = {
    createProduct,
    updateProduct,
    createPrice,
    updatePrice,
    listStripeProducts,
    getStripeProduct,
    checkout,
    webhook
}