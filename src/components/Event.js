import React, { useEffect, Fragment } from 'react'

import { useSubscription, useQuery } from '@apollo/react-hooks'

import { AdminControl, UserControl } from '../common'
import { useGameContext } from '../context/useGameContext'
import { findMyUser } from '../gql/queries'
import { listenToRounds, listenToRoundNumber } from '../gql/subscriptions'
import { useSetUserId, useFindUserById } from '../hooks'

const Event = () => {
  const { role, userId, setCurrentRound, setRoundsData } = useGameContext()

  const { data: roundsData, loading: roundLoading, error } = useSubscription(listenToRounds, {
    variables: {
      eventId: 3,
    },
  })

  const {
    data: roundNumber,
    loading: currentRoundLoading,
    error: currentRoundError,
  } = useSubscription(listenToRoundNumber, {
    variables: {
      eventId: 3,
    },
  })

  console.log('roundNumber = ', roundNumber)

  const shouldDisplayShit = roundNumber && roundNumber.events && roundsData && roundsData.rounds

  useEffect(() => {
    if (shouldDisplayShit) {
      setRoundsData(roundsData)
      setCurrentRound(roundNumber.events[0].current_round)
    }
  }, [roundNumber, roundsData])

  if (!userId) {
    return <div>no user id yet</div>
  }

  // setLoading(false)
  return <>{role === 'host' ? <AdminControl /> : <UserControl />}</>
}

export default Event
