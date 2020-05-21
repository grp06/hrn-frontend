const endpointUrl =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://api.hirightnow.com'

export default endpointUrl
