export default function startEvent({ eventId, round_length, reset, num_rounds }) {
  console.log('roundLength, numRounds ->', round_length, num_rounds)
  return fetch(`${process.env.REACT_APP_API_URL}/api/rooms/start-event/${eventId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ reset, round_length, num_rounds }),
  })
}
