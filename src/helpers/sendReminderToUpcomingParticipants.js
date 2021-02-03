const sendReminderToUpcomingParticipants = async ({ chitChatRSVPs, chitChat }) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/sms/send-reminder-to-upcoming-participants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ chitChatRSVPs, chitChat }),
  }).then((res) => res.json())
}

export default sendReminderToUpcomingParticipants
