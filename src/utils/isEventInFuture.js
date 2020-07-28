function isEventInFuture(eventDate) {
  return new Date(eventDate).getTime() > Date.now()
}

export default isEventInFuture
