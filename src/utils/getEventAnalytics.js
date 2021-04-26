const getTotalDropOffsInEvent = (event) => {
  if (!event.partners || !event.partners.length) {
    return 0
  }
  const numberOfRounds = event.num_rounds
  if (!!numberOfRounds && numberOfRounds <= 1) {
    return 0
  }
  const userDiff =
    event.partners.filter((user) => user.round === numberOfRounds).length -
    event.partners.filter((user) => user.round === 1).length
  if (!!userDiff && userDiff > 0) {
    return userDiff
  }
  return 0
}

const getRsvpsCSVData = (event) => {
  const initialData = {
    headers: [
      { label: 'name', key: 'name' },
      { label: 'Email', key: 'email' },
    ],
    data: [],
  }
  const csvData = event.event_users.reduce((all, item, index) => {
    all.data.push({
      name: item.user.first_name,
      email: item.user.email,
    })
    return all
  }, initialData)
  return csvData
}

const attendeesCSVofEventData = (event) => {
  const initialCSVData = {
    headers: [
      { label: 'name', key: 'name' },
      { label: 'Email', key: 'email' },
    ],
    data: [],
  }
  const arrayOfParticipantsIds = new Set()
  const attendeeCSVData = event.partners.reduce((csvData, partner) => {
    if (!arrayOfParticipantsIds.has(partner.user_id)) {
      // TODO probably need last name here
      csvData.data.push({ name: partner.user.first_name, email: partner.user.email })
      arrayOfParticipantsIds.add(partner.user_id)
    }
    return csvData
  }, initialCSVData)

  return attendeeCSVData
}

const getArrayOfEventParticipants = (event) => {
  const arrayOfParticipantsIds = new Set()
  event.partners.forEach((partner) => {
    if (!arrayOfParticipantsIds.has(partner.user_id)) {
      arrayOfParticipantsIds.add(partner.user_id)
    }
  })
  return [...arrayOfParticipantsIds]
}

function getEventAnalytics(event) {
  const attendeesCSVofEvent = attendeesCSVofEventData(event)
  const RSVPsCSVofEvent = getRsvpsCSVData(event)
  const eventParticipants = getArrayOfEventParticipants(event)
  const numberOfDropOffsInEvent = getTotalDropOffsInEvent(event)
  const numberOfTotalRoundsInEvent = event.num_rounds
  const roundLengthOfEvent = event.round_length
  const numberOfRSVPSinEvent = event.event_users.length

  const attendanceRateForEvent = ((eventParticipants.length / numberOfRSVPSinEvent) * 100).toFixed(
    2
  )

  return {
    attendanceRateForEvent,
    attendeesCSVofEvent,
    RSVPsCSVofEvent,
    numberOfDropOffsInEvent,
    numberOfEventParticipants: eventParticipants.length,
    numberOfRSVPSinEvent,
    numberOfTotalRoundsInEvent,
    roundLengthOfEvent,
  }
}

export default getEventAnalytics
