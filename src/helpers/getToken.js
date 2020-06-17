const getToken = async (roomId, userId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ roomId, userId }),
  })
}

export default getToken
