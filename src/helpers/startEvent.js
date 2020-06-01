import endpointUrl from '../utils/endpointUrl'

export default function startEvent(eventId, adminId) {
  fetch(`${endpointUrl}/api/rooms/start-event`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ eventId, adminId }),
  })
}
