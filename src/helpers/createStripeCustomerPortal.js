const upgradeToHost = async (customer_id) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/stripe/create-customer-portal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ customer_id, return_url: 'https://launch.hirightnow.co/my-profile' }),
  }).then((res) => res.json())
}

export default upgradeToHost
