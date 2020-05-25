import React, { useEffect, useState } from 'react'

import endpointUrl from '../utils/endpointUrl'
import { useCreateRooms, useStartRound } from '.'
import { useGameContext } from '../context/useGameContext'

export default function useCompleteRooms() {
  const [roomsCompleted, setRoomsCompleted] = useState(null)
  const { startRound } = useStartRound()
  const { roundsData } = useGameContext()

  useEffect(() => {
    if (roomsCompleted) {
      startRound(roundsData.rounds)
    }
  }, [roomsCompleted])

  const completeRooms = async () => {
    const res = await fetch(`${endpointUrl}/api/rooms/complete-rooms`)
    console.log('complete-rooms')
    setRoomsCompleted(res)
  }

  return { completeRooms }
}
