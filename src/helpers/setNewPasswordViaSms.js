const setNewPasswordViaSms = async ({ userId, token, password }) => {
  return fetch(
    `${process.env.REACT_APP_API_URL}/api/sms/set-new-password-phone/${userId}/${token}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ password }),
    }
  ).then((res) => res.json())
}

export default setNewPasswordViaSms
