const getUserById = async ({ userId, role }) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/auth/get-user-by-id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ userId, role }),
  }).then((res) => res.json())
}

export default getUserById
