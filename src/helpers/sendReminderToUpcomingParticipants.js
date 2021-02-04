const sendReminderToUpcomingParticipants = async ({
  chitChatRSVPs,
  chitChat,
  userIdOfFanToUpdate,
}) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/sms/send-reminder-to-upcoming-participants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ chitChatRSVPs, chitChat, userIdOfFanToUpdate }),
  }).then((res) => res.json())
}

export default sendReminderToUpcomingParticipants
