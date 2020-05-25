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

  const subscriptionsLoading = roundDataLoading || eventLoading
  const hasSubscriptionData = freshRoundsData && freshRoundsData.rounds
  const hostId = eventData && eventData.events[0].host_id

  useEffect(() => {
    if (freshRoundsData && freshRoundsData.rounds.length === 0 && currentRound === 0) {
      return resetUserState()
    }
  }, [freshRoundsData, currentRound])

  useEffect(() => {
    if (!subscriptionsLoading && hasSubscriptionData) {
      if (!eventIsSetInContext && eventId) {
        setEventId(eventId)
      }
      // either we're advancing or we just reset

      // if roundsData == null &&

      if (!roundsData) {
        return setGameData(freshRoundsData, userId, false)
      }

      const roundsDataLength = roundsData.rounds.length
      const freshRoundsDataLength = freshRoundsData.rounds.length
      const newRoundsData = freshRoundsDataLength > roundsDataLength
      if (newRoundsData) {
        return setGameData(freshRoundsData, userId, true)
      }
    }
  }, [freshRoundsData, subscriptionsLoading])

  if (subscriptionsLoading || appLoading || !eventIsSetInContext) {
    return <Loading />
  }

  return <>{hostId === userId ? <AdminControl /> : <UserControl />}</>
}

export default Event
