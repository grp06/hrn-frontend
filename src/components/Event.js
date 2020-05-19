import React, { useEffect } from 'react'

import { useSubscription } from '@apollo/react-hooks'

import { AdminControl, UserControl } from '../common'
import { useGameContext } from '../context/useGameContext'
import { listenToRounds, listenToRoundNumber } from '../gql/subscriptions'

const Event = ({ match }) => {
  const { id } = match.params
  const { role, userId, setCurrentRound, setRoundsData } = useGameContext()
  const { data: roundsData, loading: roundLoading, error } = useSubscription(listenToRounds, {
    variables: {
      eventId: id,
    },
  })

  const {
    data: roundNumber,
    loading: currentRoundLoading,
    error: currentRoundError,
  } = useSubscription(listenToRoundNumber, {
    variables: {
      eventId: id,
    },
  })

  const shouldDisplayShit =
    roundNumber &&
    roundNumber.events &&
    roundNumber.events.length &&
    roundsData &&
    roundsData.rounds
  console.log('roundsData', roundsData)
  console.log('roundNumber = ', roundNumber)

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
