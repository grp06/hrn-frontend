export default function startEvent(eventId, adminId) {
  fetch(`${process.env.REACT_APP_API_URL}/api/rooms/start-event/${eventId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ eventId, adminId }),
  })
}
