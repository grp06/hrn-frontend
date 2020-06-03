// make sure this makes sense when we deploy to multiple heroku env's
const endpointUrl =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://hrn-api.herokuapp.com'

export default endpointUrl
