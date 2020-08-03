const getMutualThumbsInEvent = (event) => {
  return event.rounds.reduce((thumbTotal, round) => {
    if (round.partnerY_thumb && round.partnerX_thumb) {
      thumbTotal += 1
    }
    return thumbTotal
  }, 0)
}

const getTotalDropOffsInEvent = (event) => {
  if (!event.rounds || !event.rounds.length) {
    return null
  }
  const numberOfRounds = event.rounds[event.rounds.length - 1].round_number
  const firstRound = event.rounds.filter((round) => round.round_number === 1)
  const lastRound = event.rounds.filter((round) => round.round_number === numberOfRounds)

  const firstRoundUserIdArray = firstRound
    .reduce((userIdArray, pairing) => {
      // TODO: do I need to check to see if partner id is already in array?
      if (pairing.partnerX_id) userIdArray.push(pairing.partnerX_id)
      if (pairing.partnerY_id) userIdArray.push(pairing.partnerY_id)
      return userIdArray
    }, [])
    .sort()

  const lastRoundUserIdArray = lastRound
    .reduce((userIdArray, pairing) => {
      // TODO: do I need to check to see if partner id is already in array?
      if (pairing.partnerX_id) userIdArray.push(pairing.partnerX_id)
      if (pairing.partnerY_id) userIdArray.push(pairing.partnerY_id)
      return userIdArray
    }, [])
    .sort()

  return firstRoundUserIdArray.reduce((totalDropOffs, userId) => {
    if (lastRoundUserIdArray.indexOf(userId) < 0) {
      totalDropOffs += 1
    }
    return totalDropOffs
  }, 0)
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
      name: item.user.name,
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
  const arrayOfParticipantsIds = []
  const attendeeCSVData = event.rounds.reduce((csvData, round, index) => {
    if (round.partnerX && round.partnerY) {
      const partnerXIndex = arrayOfParticipantsIds.indexOf(round.partnerX_id)
      const partnerYIndex = arrayOfParticipantsIds.indexOf(round.partnerY_id)
      if (partnerXIndex === -1) {
        arrayOfParticipantsIds.push(round.partnerX_id)
        csvData.data.push({ name: round.partnerX.name, email: round.partnerX.email })
      }
      if (partnerYIndex === -1) {
        arrayOfParticipantsIds.push(round.partnerY_id)
        csvData.data.push({ name: round.partnerY.name, email: round.partnerY.email })
      }
    }
    return csvData
  }, initialCSVData)

  return attendeeCSVData

  // This is what George originally had. Not accounting for partnerY
  // const csvData = event.rounds.reduce((all, item, index) => {
  //   const found = all.data.find((user) => {
  //     return item.partnerX && item.partnerX.email === user.email
  //   })

  //   if (!found && item.partnerX) {
  //     all.data.push({
  //       name: item.partnerX.name,
  //       email: item.partnerX.email,
  //     })
  //   }

  //   return all
  // }, initialData)

  // return csvData
}

const getArrayOfEventParticipants = (event) => {
  const arrayOfParticipantsIds = []
  return event.rounds
    .reduce((allParticipants, round, index) => {
      const partnerXIndex = arrayOfParticipantsIds.indexOf(round.partnerX_id)
      const partnerYIndex = arrayOfParticipantsIds.indexOf(round.partnerY_id)
      if (partnerXIndex === -1) {
        arrayOfParticipantsIds.push(round.partnerX_id)
        allParticipants.push(round.partnerX)
      }
      if (partnerYIndex === -1) {
        arrayOfParticipantsIds.push(round.partnerY_id)
        allParticipants.push(round.partnerY)
      }
      return allParticipants
    }, [])
    .filter((participant) => participant !== null)
}

function getEventAnalytics(event) {
  const attendeesCSVofEvent = attendeesCSVofEventData(event)
  const RSVPsCSVofEvent = getRsvpsCSVData(event)
  const eventParticipants = getArrayOfEventParticipants(event)
  const numberOfMutualThumbsInEvent = getMutualThumbsInEvent(event)
  const numberOfDropOffsInEvent = getTotalDropOffsInEvent(event)
  const numberOfTotalRoundsInEvent = event.num_rounds
  const roundLengthOfEvent = event.round_length
  const numberOfRSVPSinEvent = event.event_users.length
  const relevancyOfEvent = (
    (numberOfMutualThumbsInEvent / (eventParticipants.length * numberOfTotalRoundsInEvent)) *
    100
  ).toFixed(2)
  const attendanceRateForEvent = ((eventParticipants.length / numberOfRSVPSinEvent) * 100).toFixed(
    2
  )

  return {
    attendanceRateForEvent,
    attendeesCSVofEvent,
    RSVPsCSVofEvent,
    numberOfDropOffsInEvent,
    numberOfEventParticipants: eventParticipants.length,
    numberOfMutualThumbsInEvent,
    numberOfTotalRoundsInEvent,
    relevancyOfEvent,
    roundLengthOfEvent,
  }
}

export default getEventAnalytics
