import React from 'react'

import { useSubscription } from '@apollo/react-hooks'

import { useGameContext } from '../context/useGameContext'
import { listenToRoundsData } from '../gql/subscriptions'

const useRoundsData = () => {
  const { setRoundsData, roundsData } = useGameContext()

  const { loading, error, data } = useSubscription(listenToRoundsData)
  if (loading) {
    return <div>loading rounds data...</div>
  }
  if (error) {
    return <div>error from rounds data</div>
  }
  if (data && data.rounds.length) {
    setRoundsData(data.rounds)
    return { roundsData }
  }
  return null
}

export default useRoundsData
