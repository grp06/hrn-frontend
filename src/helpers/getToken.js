const getToken = async (uniqueName, userId) => {
  // wont be used anymore
  return fetch(`${process.env.REACT_APP_API_URL}/api/twilio/get-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uniqueName, userId }),
  })
}

export default getToken
