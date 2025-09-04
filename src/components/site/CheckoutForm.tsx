import { useState } from 'react';
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function CheckoutForm() {
  const [email, setEmail] = useState('');
//   const stripe = useStripe();
//   const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // if (!stripe || !elements) return;

    // const { error, paymentMethod } = await stripe.createPaymentMethod({
    //   type: 'card',
    //   card: elements.getElement(CardElement),
    //   billing_details: { email },
    // });

    // if (error) {
    //   console.error(error);
    // } else {
    //   console.log('PaymentMethod created:', paymentMethod);
    //   // Enviar paymentMethod.id para o backend para criar o pagamento
    // }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Seu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {/* <CardElement /> */}
      {/* <button type="submit" disabled={!stripe}>Assinar</button> */}
    </form>
  );
}

export default CheckoutForm;
