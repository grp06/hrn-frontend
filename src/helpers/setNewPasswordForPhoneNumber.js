const setNewPasswordForPhoneNumber = async ({ userId, token, password }) => {
  console.log('🚀 ~ setNewPasswordForPhoneNumber ~ password', password)
  return fetch(`${process.env.REACT_APP_API_URL}/api/sms/set-new-password/${userId}/${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ password }),
  }).then((res) => res.json())
}

export default setNewPasswordForPhoneNumber
