// some payment methods require a customer to do additional authentication
// with their financial institution Eg. 2fa for cards.
const handlePaymentThatRequiresCustomerAction = async ({
  subscription,
  invoice,
  plan,
  paymentMethodId,
  isRetry,
  stripe,
}) => {
  // subscription is active, meaning that everything succeeded, no customer actions required.
  if (subscription && subscription.status === 'active') {
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
      .confirmCardPayment(paymentIntent.client_secret, { payment_method: paymentMethodId })
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

// If attaching a card to a Customoer object succeeds,
// but the attempts to charge the customer fail. You will
// get a requires_payment_method error
const handleRequiresPaymentMethod = async ({ subscription, paymentMethodId, plan }) => {
  // subscription is active, meaning that everything succeeded, no customer actions required.
  if (subscription.status === 'active') {
    return { subscription, paymentMethodId, plan }
  }

  // the card has failed to be charged, so the user might have to switch their card
  // we save the latestInvoiceId and intent status so that when we rerun createSubscription,
  // we just update the already created invoice, instead of making a new one
  if (subscription.latest_invoice.payment_intent.status === 'requires_payment_method') {
    localStorage.setItem('latestInvoiceId', subscription.latest_invoice.id)
    localStorage.setItem(
      'latestInvoicePaymentIntentStatus',
      subscription.latest_invoice.payment_intent.status
    )
    console.log('Your card was declined')
    throw new Error('Your card was declined')
  } else {
    return { subscription, paymentMethodId, plan }
  }
}

const createSubscription = async ({
  paymentMethodId,
  plan,
  stripeCustomerId,
  stripe,
  userId,
  userEmail,
}) => {
  const subscriptionResponse = await fetch(
    `${process.env.REACT_APP_API_URL}/api/stripe/create-subscription`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        customerId: stripeCustomerId,
        paymentMethodId,
        plan,
        userId,
        userEmail,
      }),
    }
  ).then((res) => res.json())

  // if the card is declined, display an error to the user
  if (subscriptionResponse.error) {
    console.log('[createSubscription error]', subscriptionResponse.error)
  }

  console.log('subscriptionResponse ->', subscriptionResponse)

  // some payment methods require a customer to do additional authentication
  // with their financial institution Eg. 2fa for cards.
  await handlePaymentThatRequiresCustomerAction({
    plan,
    paymentMethodId,
    subscription: subscriptionResponse.subscriptionObject,
    stripe,
  })

  await handleRequiresPaymentMethod({
    plan,
    paymentMethodId,
    subscription: subscriptionResponse.subscriptionObject,
  })

  return {
    subscription: subscriptionResponse.subscriptionObject,
    paymentMethodId,
    plan,
    token: subscriptionResponse.token,
  }

  // TODO add onSubscriptionComplete
}

const retryInvoiceWithNewPaymentMethod = async ({
  stripeCustomerId,
  paymentMethodId,
  invoiceId,
  plan,
  userId,
  userEmail,
}) => {
  const retryResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/stripe/retry-invoice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      customerId: stripeCustomerId,
      paymentMethodId,
      invoiceId,
      plan,
      userId,
      userEmail,
    }),
  }).then((res) => res.json())

  // if the card is declined, diaply an error to the user
  if (retryResponse.error) {
    // the card had an error when trying to attach it to the customer
    console.log('[retryInvoiceWithNewPaymentMethod error]', retryResponse.error)
  }

  await handlePaymentThatRequiresCustomerAction({
    invoice: retryResponse.invoice,
    paymentMethodId,
    plan,
    isRetry: true,
  })

  return { invoice: retryResponse.invoice, paymentMethodId, plan, token: retryResponse.token }
}

export {
  createSubscription,
  handlePaymentThatRequiresCustomerAction,
  handleRequiresPaymentMethod,
  retryInvoiceWithNewPaymentMethod,
}
