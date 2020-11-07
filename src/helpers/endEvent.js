export default function endEvent(eventId) {
  return fetch(`${process.env.REACT_APP_API_URL}/api/rooms/end-event/${eventId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  })
}