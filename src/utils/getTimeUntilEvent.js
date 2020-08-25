const getTimeUntilEvent = (eventStartTime) => {
  const startTime = new Date(eventStartTime).getTime()
  const now = Date.now()
  const diff = startTime - now
  // we dont want to return negative numbers, just return 0 if negative
  return diff > 0 ? diff : 0
}

export default getTimeUntilEvent
