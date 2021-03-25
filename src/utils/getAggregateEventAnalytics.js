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

  return {
    averageAttendanceRate: Math.round(totalAttendanceRate / arrayOfEvents.length),
    averageRSVPs: Math.round(totalNumberOfRSVPs / arrayOfEvents.length),
    totalNumberOfConnections: totalNumberOfConnections,
    averageNumberOfConnections: (totalNumberOfConnections / arrayOfEvents.length).toFixed(2),
  }
}

export default getAggregateEventAnalytics
