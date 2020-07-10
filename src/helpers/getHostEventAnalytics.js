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

const getRsvps = (event) => {
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

const getAttendees = (event) => {
  const initialData = {
    headers: [
      { label: 'name', key: 'name' },
      { label: 'Email', key: 'email' },
    ],
    data: [],
  }
  const csvData = event.rounds.reduce((all, item, index) => {
    const found = all.data.find((user) => {
      return item.partnerX && item.partnerX.email === user.email
    })

    if (!found && item.partnerX) {
      all.data.push({
        name: item.partnerX.name,
        email: item.partnerX.email,
      })
    }

    return all
  }, initialData)

  return csvData
}

function getHostEventAnalytics(event) {
  const mutualThumbsInEvent = getMutualThumbsInEvent(event)
  const dropOffsInEvent = getTotalDropOffsInEvent(event)
  const getRSVPs = getRsvps(event)
  const getAttendeesCSV = getAttendees(event)
  return {
    mutualThumbsInEvent,
    dropOffsInEvent,
    getRSVPs,
    getAttendeesCSV,
  }
}

export default getHostEventAnalytics
