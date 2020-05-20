import React, { useEffect } from 'react'

import { useSubscription } from '@apollo/react-hooks'

import { AdminControl, UserControl, Loading } from '../common'
import { useGameContext } from '../context/useGameContext'
import { listenToRounds, listenToRoundNumber } from '../gql/subscriptions'

let renders = 0
const Event = ({ match }) => {
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
  console.log('role = ', role)

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

  renders += 1
  // does it need to render so many times? Thought my loading logic took care of it...
  console.log('renders = ', renders)
  console.log('Event -> eventData', eventData)
  console.log('Event -> roundsData', roundsData)

  return <>{role === 'host' ? <AdminControl eventId={id} /> : <UserControl />}</>
}

export default Event
