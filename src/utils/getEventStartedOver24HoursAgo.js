const getEventStartedOver24HoursAgo = (eventStartAt) => {
  const now = new Date()
  const eventStartDateObject = new Date(eventStartAt)
  eventStartDateObject.setDate(eventStartDateObject.getDate() + 1)
  return eventStartDateObject < now
}

export default getEventStartedOver24HoursAgo
