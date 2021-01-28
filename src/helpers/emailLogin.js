const emailLogin = async ({ email, password }) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/auth-new/email-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ email, password }),
  }).then((res) => res.json())
}

export default emailLogin
