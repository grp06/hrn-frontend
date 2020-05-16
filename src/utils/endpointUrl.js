const endpointUrl =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://hrn-api.herokuapp.com'

export default endpointUrl
