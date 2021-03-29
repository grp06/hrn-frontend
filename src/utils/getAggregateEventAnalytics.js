import { getEventAnalytics } from '.'

function getAggregateEventAnalytics(arrayOfEvents) {
  let totalAttendanceRate = 0
  let totalNumberOfRSVPs = 0
  let totalNumberOfConnections = 0

  arrayOfEvents.forEach((event) => {
    console.log(event.status)
    if (event.status === 'complete') {
      const {
        attendanceRateForEvent,
        numberOfRSVPSinEvent,
        numberOfMutualThumbsInEvent,
      } = getEventAnalytics(event)
      totalAttendanceRate += parseFloat(attendanceRateForEvent, 10)
      totalNumberOfRSVPs += numberOfRSVPSinEvent
      totalNumberOfConnections += numberOfMutualThumbsInEvent
    }
  })

  const uniqueRSVPsAndAttendees = arrayOfEvents.reduce(
    (all, event) => {
      event.partners.forEach((pairing) => {
        if (!all.arrOfUniqueAttendees.includes(pairing.user_id)) {
          all.arrOfUniqueAttendees.push(pairing.user_id)
        }
      })

      event.event_users.forEach((eventUser) => {
        const userId = eventUser.user.id
        if (!all.arrOfUniqueRSVPs.includes(userId)) {
          all.arrOfUniqueRSVPs.push(userId)
        }
      })

      return all
    },
    { arrOfUniqueRSVPs: [], arrOfUniqueAttendees: [] }
  )

  return {
    averageAttendanceRate: Math.round(totalAttendanceRate / arrayOfEvents.length),
    averageRSVPs: Math.round(totalNumberOfRSVPs / arrayOfEvents.length),
    totalNumberOfConnections: totalNumberOfConnections,
    averageNumberOfConnections: (totalNumberOfConnections / arrayOfEvents.length).toFixed(2),
    totalNumberOfUniqueRSVPs: uniqueRSVPsAndAttendees.arrOfUniqueRSVPs?.length,
    totalNumberOfUniqueAttendees: uniqueRSVPsAndAttendees.arrOfUniqueAttendees?.length,
  }
}

export default getAggregateEventAnalytics
