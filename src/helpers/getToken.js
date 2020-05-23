import { endpointUrl } from '../utils'

const getToken = async (roomId, userId) => {
  return fetch(`${endpointUrl}/api/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ roomId, myUserId: userId }),
  })
}

export default getToken
