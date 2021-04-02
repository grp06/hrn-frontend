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

  // THE NEXT 3 FUNCS ARE FOR TOTAL REPEAT ATTENDEES
  // create an array of arrays with attendees for each event
  const arraysOfAttendeesForEachEvent = arrayOfEvents.reduce((all, event, idx) => {
    if (event.status === 'complete') {
      const arrayOfAttendeesForThisEvent = []
      event.partners.forEach((pairing) => {
        if (!arrayOfAttendeesForThisEvent.includes(pairing.user_id)) {
          arrayOfAttendeesForThisEvent.push(pairing.user_id)
        }
      })
      all.push(arrayOfAttendeesForThisEvent)
    }
    return all
  }, [])

  // create a map for each userId and count how many times they are in an event
  const mapOfEachAttendeesEventFrequency = arraysOfAttendeesForEachEvent.reduce(
    (all, eventAttendeeArray) => {
      eventAttendeeArray.forEach((userId) => {
        if (!all[userId]) {
          all[userId] = 1
        } else all[userId] += 1
      })
      return all
    },
    {}
  )

  // squash that object and just return the ones where frequency is greater than 1
  const totalNumberOfRepeatAttendees = Object.values(mapOfEachAttendeesEventFrequency).filter(
    (frequency) => frequency > 1
  ).length

  return {
    averageAttendanceRate: Math.round(totalAttendanceRate / arrayOfEvents.length),
    averageRSVPs: Math.round(totalNumberOfRSVPs / arrayOfEvents.length),
    totalNumberOfConnections: totalNumberOfConnections,
    averageNumberOfConnections: (totalNumberOfConnections / arrayOfEvents.length).toFixed(2),
    totalNumberOfUniqueRSVPs: uniqueRSVPsAndAttendees.arrOfUniqueRSVPs?.length,
    totalNumberOfUniqueAttendees: uniqueRSVPsAndAttendees.arrOfUniqueAttendees?.length,
    totalNumberOfRepeatAttendees,
  }
}

export default getAggregateEventAnalytics
