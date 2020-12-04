const createStripeCustomer = async (email, name, userId) => {
  const customerResponse = await fetch(
    `${process.env.REACT_APP_API_URL}/api/stripe/create-customer`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ email, name, userId }),
    }
  ).then((res) => res.json())

  console.log('[createStripeCustomerResponse] ->', customerResponse)
  return customerResponse
}

export default createStripeCustomer
