import React, { useState, useEffect } from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import { useLazyQuery, useQuery } from 'react-apollo'
import { Grid } from '@material-ui/core'

import { NewEventForm, SubscriptionEndedCard, UpgradePlanCard, useCreateEventStyles } from '.'
import { Loading } from '../../common'
import { useUserContext } from '../../context'
import { getHostEventsAndPartners, getEventById } from '../../gql/queries'
import { getIsSubPeriodOver } from '../../utils'

const CreatEvent: React.FC<{}> = () => {
  const classes = useCreateEventStyles()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const eventIdFromURL = searchParams.get('eventId')
  const { user, userContextLoading } = useUserContext()
  const { id: user_id, role, sub_period_end } = user
  const [componentToShow, setComponentToShow] = useState<string>('event-form')
  const [eventDetails, setEventDetails] = useState<object>({})
  const [timeSinceSubEnded, setTimeSinceSubEnded] = useState<string>('')
  const userIsAPaidHost = role && (role.includes('starter') || role.includes('premium'))

  const { data: eventsData, loading: eventsLoading } = useQuery(getHostEventsAndPartners, {
    variables: {
      user_id,
    },
    skip: !user_id,
  })

  const [getEventByIdQuery] = useLazyQuery(getEventById, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      const [eventDetails] = data.events
      setEventDetails(eventDetails)
    },
  })

  useEffect(() => {
    if (eventIdFromURL) {
      getEventByIdQuery({ variables: { event_id: eventIdFromURL } })
    }
  }, [eventIdFromURL, getEventByIdQuery])

  useEffect(() => {
    if (role && role === 'host' && eventsData?.events.length) {
      setComponentToShow('upgrade-plan')
    }
  }, [eventsData, role])

  useEffect(() => {
    if (userIsAPaidHost && sub_period_end) {
      const { isSubPeriodOver, subPeriodEnds } = getIsSubPeriodOver(sub_period_end)
      if (isSubPeriodOver) {
        setComponentToShow('subscription-ended')
        setTimeSinceSubEnded(subPeriodEnds)
      }
    }
  }, [sub_period_end, userIsAPaidHost])

  if (eventsLoading || userContextLoading) {
    return <Loading />
  }

  // REDIRECTS
  if (!user_id) {
    return <Redirect to="/" />
  }

  if (user_id && !role.includes('host')) {
    return <Redirect to="/events" />
  }

  const renderComponentToShow = () => {
    switch (componentToShow) {
      case 'subscription-ended':
        return <SubscriptionEndedCard timeSinceSubEnded={timeSinceSubEnded} />
      case 'upgrade-plan':
        return <UpgradePlanCard />
      case 'event-form':
      default:
        return <NewEventForm eventDetails={eventDetails} userId={user_id} />
    }
  }

  return eventIdFromURL && !Object.keys(eventDetails).length ? (
    <Loading />
  ) : (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      className={classes.createEventPageContainer}
    >
      {renderComponentToShow()}
    </Grid>
  )
}

export default CreatEvent
