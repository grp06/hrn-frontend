import React, { useEffect } from 'react'

import { useSubscription, useQuery } from '@apollo/react-hooks'

import { AdminControl, UserControl, Loading } from '../common'
import { useGameContext } from '../context/useGameContext'
import { listenToRounds, listenToRoundNumber } from '../gql/subscriptions'
import { getEvent } from '../gql/queries'

const Event = ({ match }) => {
  const { id: eventId } = match.params
  const {
    appLoading,
    setGameData,
    eventId: eventIsSetInContext,
    currentRound,
    resetUserState,
    setEventId,
    userId,
    roundsData,
  } = useGameContext()

  const { data: eventData, loading: eventLoading, error: eventError } = useQuery(getEvent, {
    variables: {
      id: eventId,
    },
  })

  const {
    data: freshRoundsData,
    loading: roundDataLoading,
    error: roundDataError,
  } = useSubscription(listenToRounds, {
    variables: {
      eventId: eventId,
    },
  })

  const hasSubscriptionData = freshRoundsData && freshRoundsData.rounds
  const hostId = eventData && eventData.events[0].host_id

  useEffect(() => {
    if (freshRoundsData && freshRoundsData.rounds.length === 0 && currentRound === 0) {
      return resetUserState()
    }
  }, [freshRoundsData, currentRound])
  console.log('freshRoundsData = ', freshRoundsData)
  useEffect(() => {
    if (!roundDataLoading && hasSubscriptionData) {
      if (!eventIsSetInContext && eventId) {
        setEventId(eventId)
      }

      console.log('roundsData ', roundsData)
      console.log('freshRoundsData ', freshRoundsData)
      if (!roundsData || !roundsData.rounds.length) {
        return setGameData(freshRoundsData, userId)
      }

      const roundsDataLength = roundsData.rounds.length
      const freshRoundsDataLength = freshRoundsData.rounds.length
      const newRoundsData = freshRoundsDataLength > roundsDataLength
      const adminIsResettingGame = freshRoundsDataLength < roundsDataLength

      if (newRoundsData || adminIsResettingGame) {
        return setGameData(freshRoundsData, userId)
      }
    }
  }, [freshRoundsData, roundDataLoading, hasSubscriptionData])

  if (roundDataLoading || appLoading || !eventIsSetInContext) {
    return <Loading />
  }

  return <>{hostId === userId ? <AdminControl /> : <UserControl />}</>
}

export default Event
