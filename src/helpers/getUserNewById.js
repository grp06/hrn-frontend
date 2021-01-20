const getUserById = async ({ userId }) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/auth-new/get-user-by-id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ userId }),
  }).then((res) => res.json())
}

export default getUserById
