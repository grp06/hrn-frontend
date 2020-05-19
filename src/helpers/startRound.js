import endpointUrl from '../utils/endpointUrl'

const startRound = async (rounds, currentRound) => {
  const currentRoundObj = rounds.filter((round) => round.round_number === currentRound + 1)
  debugger
  if (currentRoundObj.length > 0) {
    const allPartnerXs = currentRoundObj.reduce((all, item, index) => {
      all.push(item.partnerX_id)
      return all
    }, [])
    console.log('allparnerx = ', allPartnerXs)
    fetch(`${endpointUrl}/api/rooms/create-rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(allPartnerXs),
    })
  } else {
    // we should do nothing here
    // or set game to be over
  }
}

export default startRound
