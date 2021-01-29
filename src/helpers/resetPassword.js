const resetPassword = async ({ phoneNumber, email }) => {
  const resetURL = email
    ? `${process.env.REACT_APP_API_URL}/api/email/reset_password/user/${email}`
    : `${process.env.REACT_APP_API_URL}/api/sms/reset-password`

  const body = email ? { email } : { phoneNumber }
  console.log('🚀 ~ resetPassword ~ body', body)

  return fetch(`${resetURL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
  }).then((res) => res.json())
}

export default resetPassword
