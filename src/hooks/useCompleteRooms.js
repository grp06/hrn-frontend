import React, { useEffect, useState } from 'react'

import endpointUrl from '../utils/endpointUrl'
import { useStartRound } from '.'
import { useGameContext } from '../context/useGameContext'

export default function useCompleteRooms() {
  const [roomsCompleted, setRoomsCompleted] = useState(null)

  const completeRooms = async () => {
    const res = await fetch(`${endpointUrl}/api/rooms/complete-rooms`)
  }

  return { completeRooms }
}
