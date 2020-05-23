import endpointUrl from '../utils/endpointUrl'

export default function useCreateRooms() {
  const createRooms = async (allRoomIds) => {
    fetch(`${endpointUrl}/api/rooms/create-rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(allRoomIds),
    })
  }

  return { createRooms }
}
