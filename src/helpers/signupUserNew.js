const signupUserNew = async ({ role, userInfo, chitChat }) => {
  const { cashApp, email, name, password, phone_number, venmo } = userInfo
  return fetch(`${process.env.REACT_APP_API_URL}/api/sign-up-new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      cash_app: cashApp,
      email,
      name,
      password,
      phone_number,
      role,
      venmo,
      chitChat,
    }),
  }).then((res) => res.json())
}

export default signupUserNew
