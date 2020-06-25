const getMutualThumbsInEvent = (event) => {
  return event.rounds.reduce((thumbTotal, round) => {
    if (round.partnerY_thumb && round.partnerX_thumb) {
      thumbTotal++
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
  // console.log('numberOfRounds ->', numberOfRounds)
  // console.log('firstRound ->', firstRound)
  // console.log('lastRound ->', lastRound)

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

  // console.log('lastRoundUserIdArray ->', lastRoundUserIdArray)
  // console.log('firstRoundUserIdArray ->', firstRoundUserIdArray)

  return firstRoundUserIdArray.reduce((totalDropOffs, userId) => {
    if (lastRoundUserIdArray.indexOf(userId) < 0) {
      totalDropOffs++
    }
    return totalDropOffs
  }, 0)
}

const getTotalAttendeesInEvent = (event) => {
  const masterRoundsMap = event.rounds.reduce((roundsMap, pairing) => {
    const { round_number } = pairing
    roundsMap[round_number] = roundsMap[round_number] + 1 || 1
    return roundsMap
  }, {})

  const roundWithMostPairings = Object.keys(masterRoundsMap).reduce(
    (a, b) => (masterRoundsMap[a] > masterRoundsMap[b] ? a : b),
    0
  )

  // console.log('roundWithMostPairings ->', roundWithMostPairings)
  // console.log('masterRoundsMap ->', masterRoundsMap)

  return masterRoundsMap[roundWithMostPairings] * 2
}

function getHostEventAnalytics(event) {
  const mutualThumbsInEvent = getMutualThumbsInEvent(event)
  const dropOffsInEvent = getTotalDropOffsInEvent(event)
  const totalAttendeesInEvent = getTotalAttendeesInEvent(event)

  return { mutualThumbsInEvent, dropOffsInEvent, totalAttendeesInEvent }
}

export default getHostEventAnalytics
