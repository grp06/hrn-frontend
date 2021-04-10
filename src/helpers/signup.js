const signup = async ({ email, first_name, last_name, password }) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ email, first_name, last_name, password, role: 'user' }),
  }).then((res) => res.json())
}

export default signup
