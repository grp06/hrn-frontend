import React, { useEffect } from 'react'
import { useMutation } from 'react-apollo'
import { useGameContext } from '../context/useGameContext'
import endpointUrl from '../utils/endpointUrl'
import { incrementRound } from '../gql/mutations'

// call API which will disconnect all users from their rooms
// it should also complete the rooms afterwards
// then we want to create new rooms
// then increment
export default function useStartRounds() {
  const { currentRound, roundsData } = useGameContext()
  const [incrementRoundMutation] = useMutation(incrementRound)

  useEffect(() => {}, [])

  const startRound = (rounds) => {
    const currentRoundObj = rounds.filter((round) => round.round_number === currentRound + 1)

    const allRoomIds = currentRoundObj.reduce((all, item) => {
      all.push(item.id)
      return all
    }, [])

    console.log('allRoomIds = ', allRoomIds)
    fetch(`${endpointUrl}/api/rooms/create-rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(allRoomIds),
    }).then(() => {
      incrementRoundMutation()
    })
  }

  return { startRound }
}
