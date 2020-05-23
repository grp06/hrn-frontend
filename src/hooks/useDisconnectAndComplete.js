import endpointUrl from '../utils/endpointUrl'

// call API which will disconnect all users from their rooms
// it should also complete the rooms afterwards
// then we want to create new rooms
// then increment
export default function useDisconnectAndComplete() {
  const disconnectAndComplete = async () => {
    fetch(`${endpointUrl}/api/rooms/prepareNextRound`)
      .then((res) => {
        return res.json()
      })
      .then((completedRooms) => {
        console.log('completedRooms ==== ', completedRooms)
      })
  }

  return { disconnectAndComplete }
}
