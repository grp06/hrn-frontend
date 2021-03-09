const rsvpForEvent = async (event, insertEventUserMutation, usersEmail, usersName) => {
  const { description, event_name, host, id: event_id, start_at: event_start_time } = event
  const { name: host_name } = host
  let calendarInviteResponse
  try {
    await insertEventUserMutation()

    window.analytics.track('RSVP made', {
      eventId: event_id,
      eventName: event_name,
    })
  } catch (error) {
    console.log('error = ', error)
  }
  try {
    calendarInviteResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/api/email/send-calendar-invite`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          name: usersName,
          email: usersEmail,
          event_name,
          event_id,
          description,
          event_start_time,
          host_name,
        }),
      }
    ).then((response) => response.json())

    if (calendarInviteResponse.error) {
      throw calendarInviteResponse.error
    }
  } catch (error) {
    console.log('error = ', error)
  }
}

export default rsvpForEvent
