import endpointUrl from '../utils/endpointUrl'

const startRound = async (rounds, currentRound) => {
  const currentRoundObj = rounds.filter((round) => round.round_number === currentRound + 1)
  console.log('startRound -> currentRoundObj', currentRoundObj)
  if (currentRoundObj.length > 0) {
    const allRoomIds = currentRoundObj.reduce((all, item) => {
      all.push(item.id)
      return all
    }, [])
    console.log('allRoomIds = ', allRoomIds)
    fetch(`http://api.hirightnow.com/api/rooms/create-rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(allRoomIds),
    })
  } else {
    // we should do nothing here
    // or set game to be over
  }
}

export default startRound
