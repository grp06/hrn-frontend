const getUnsplashImageURL = async (keyword) => {
  return fetch(`${process.env.REACT_APP_API_URL}/get-unsplash-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ keyword }),
  }).then((response) => response.json())
}

export default getUnsplashImageURL
