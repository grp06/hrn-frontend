import React, { useEffect, useState } from 'react'

import endpointUrl from '../utils/endpointUrl'
import { useCreateRooms, useStartRound } from '.'
import { useGameContext } from '../context/useGameContext'

// call API which will disconnect all users from their rooms
// it should also complete the rooms afterwards
// then we want to create new rooms
// then increment
export default function useCompleteAndCreateRooms() {
  const [roomsCompleted, setRoomsCompleted] = useState()
  const [roomsCreated, setRoomsCreated] = useState()
  const { createRooms } = useCreateRooms()
  const { startRound } = useStartRound()
  const { roundsData } = useGameContext()

  useEffect(() => {
    if (roomsCompleted) {
      startRound(roundsData.rounds)
    }
  }, [roomsCompleted])

  const completeAndCreateRooms = async () => {
    const res = await fetch(`${endpointUrl}/api/rooms/complete-rooms`)
    console.log('complete-rooms')
    setRoomsCompleted(res)
  }

  return { completeAndCreateRooms }
}
