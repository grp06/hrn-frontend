import React, { useEffect } from 'react'

import { useSubscription } from '@apollo/react-hooks'

import { AdminControl, UserControl, Loading } from '../common'
import { useGameContext } from '../context/useGameContext'
import { listenToRounds, listenToRoundNumber } from '../gql/subscriptions'

const Event = ({ match }) => {
  const { id: eventId } = match.params
  const { role, appLoading, setGameData, eventId: eventIsSetInContext } = useGameContext()
  const { data: roundsData, loading: roundDataLoading, error: roundDataError } = useSubscription(
    listenToRounds,
    {
      variables: {
        eventId: eventId,
      },
    }
  )

  const { data: eventData, loading: eventDataLoading, error: eventDataError } = useSubscription(
    listenToRoundNumber,
    {
      variables: {
        eventId: eventId,
      },
    }
  )

  const haveSubscriptionError = eventDataError || roundDataError
  const subscriptionsLoading = roundDataLoading || eventDataLoading
  const dataReady = roundsData && roundsData.rounds && eventData

  useEffect(() => {
    if (!subscriptionsLoading && !haveSubscriptionError && dataReady) {
      setGameData(roundsData, eventData.events[0].current_round, eventId)
    }
  }, [eventData, roundsData, subscriptionsLoading])

  if (subscriptionsLoading || appLoading || !eventIsSetInContext) {
    return <Loading />
  }

  if (haveSubscriptionError) {
    return <div>Bad news. We have errors</div>
  }

  return <>{role === 'host' ? <AdminControl /> : <UserControl />}</>
}

export default Event
