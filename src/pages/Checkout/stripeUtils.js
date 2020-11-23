const handlePaymentThatRequiresCustomerAction = ({
  subscription,
  invoice,
  plan,
  paymentMethodId,
  isRetry,
  stripe,
}) => {
  if (subscription && subscription.status === 'active') {
    // subscription is active, no customer actions required.
    return { subscription, plan, paymentMethodId }
  }

  // if its a first payment attempt, the payment intent is on the subscription latest invoce
  // if its a retry, the payment intent will be on the invoice itself.

  const paymentIntent = invoice
    ? invoice.payment_intent
    : subscription.latest_invoice.payment_intent

  if (
    paymentIntent.status === 'requires_action' ||
    (isRetry === true && paymentIntent.status === 'requires_payment_method')
  ) {
    return stripe
      .confirmCardPayment(paymentIntent.client_secret, { payment_menthod: paymentMethodId })
      .then((res) => {
        if (res.error) {
          console.log(res.error)
          throw res
        }
        if (res.paymentIntent.status === 'succeeded') {
          return {
            plan,
            subscription,
            invoice,
            paymentMethodId,
          }
        }
      })
  }
  // no customer action needed
  return { subscription, plan, paymentMethodId }
}

const handleRequiresPaymentMethod = ({ subscription, paymentMethodId, plan }) => {
  // subscription is active, no customer actions required.
  if (subscription.status === 'active') {
    return { subscription, paymentMethodId, plan }
  }

  if (subscription.latest_invoice.payment_intent.status === ' requires_payment_method') {
    localStorage.setItem('latestInvoiceId', subscription.latest_invoice.id)
    localStorage.setItem(
      'latestInvoicePaymentIntentStatus',
      subscription.latest_invoice.payment_intent.status
    )
    throw new Error('Your card was declined')
  } else {
    return { subscription, paymentMethodId, plan }
  }
}

const createSubscription = async ({ paymentMethodId, plan, stripeCustomerId, stripe }) => {
  const subscriptionResponse = await fetch(
    `${process.env.REACT_APP_API_URL}/api/stripe/create-subscription`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ customerId: stripeCustomerId, paymentMethodId, plan }),
    }
  ).then((res) => res.json())

  // if the card is declined, display an error to the user
  if (subscriptionResponse.error) {
    console.log('[createSubscription error]', subscriptionResponse.error)
  }

  console.log('subscriptionResponse ->', subscriptionResponse)

  // some payment methods require a customer to do additional authentication
  // with their financial institution Eg. 2fa for cards.
  handlePaymentThatRequiresCustomerAction({
    plan,
    paymentMethodId,
    subscription: subscriptionResponse,
    stripe,
  })

  handleRequiresPaymentMethod({ plan, paymentMethodId, subscription: subscriptionResponse })
  // handleRequiresPaymentMethod
  // onSubscriptionComplete
}

export { createSubscription, handlePaymentThatRequiresCustomerAction, handleRequiresPaymentMethod }
