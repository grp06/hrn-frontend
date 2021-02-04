export default function getAnonymousToken() {
  // make sure to make this change in the main API project .. the existing app depends on it
  return fetch(`${process.env.REACT_APP_API_URL}/api/sign-up-new/get-anonymous-token`, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  })
}
