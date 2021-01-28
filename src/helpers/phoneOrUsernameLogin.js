const phoneOrUsernameLogin = async ({ phone_number, username, password }) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/auth-new/phone-or-username-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ phone_number, username, password }),
  }).then((res) => res.json())
}

export default phoneOrUsernameLogin
