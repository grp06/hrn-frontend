export default function getAnonymousToken() {
  return fetch(`${process.env.REACT_APP_API_URL}/api/signup/get-anonymous-token`, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  })
}
