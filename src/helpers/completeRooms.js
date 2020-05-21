import endpointUrl from '../utils/endpointUrl'

const completeRooms = () => {
  fetch(`${endpointUrl}/api/rooms/complete-rooms`)
    .then((res) => {
      return res.json()
    })
    .then((completedRooms) => {
      console.log('completedRooms ==== ', completedRooms)
    })
}

export default completeRooms
