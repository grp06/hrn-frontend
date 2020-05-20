import React, { useEffect } from 'react'

import { useSubscription } from '@apollo/react-hooks'

import { AdminControl, UserControl, Loading } from '../common'
import { useGameContext } from '../context/useGameContext'
import { listenToRounds, listenToRoundNumber } from '../gql/subscriptions'

const Event = ({ match }) => {
  console.log('hi')
  const { id } = match.params
  const { role, setCurrentRound, setRoundsData, appLoading } = useGameContext()
  const { data: roundsData, loading: roundDataLoading, error: roundDataError } = useSubscription(
    listenToRounds,
    {
      variables: {
        eventId: id,
      },
    }
  )

  const { data: eventData, loading: eventDataLoading, error: eventDataError } = useSubscription(
    listenToRoundNumber,
    {
      variables: {
        eventId: id,
      },
    }
  )

  const haveSubscriptionError = eventDataError || roundDataError
  const subscriptionsLoading = roundDataLoading || eventDataLoading

  useEffect(() => {
    if (!subscriptionsLoading && !haveSubscriptionError) {
      setRoundsData(roundsData)
      setCurrentRound(eventData.events[0].current_round)
    }
  }, [eventData, roundsData])

  if (subscriptionsLoading || appLoading) {
    return <Loading />
  }

  if (haveSubscriptionError) {
    return <div>Bad news. We have errors</div>
  }
  console.log('are we getting here????')
  return <>{role === 'host' ? <AdminControl eventId={id} /> : <UserControl />}</>
}

export default Event
