export default function useCreateRooms() {
  const createRooms = async (allRoomIds) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/rooms/create-rooms`, {
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
