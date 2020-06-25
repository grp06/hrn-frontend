const getToken = async (uniqueName, userId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uniqueName, userId }),
  })
}

export default getToken
