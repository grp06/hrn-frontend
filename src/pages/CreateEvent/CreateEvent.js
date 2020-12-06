import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useQuery } from 'react-apollo'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'

import { NewEventForm, SubscriptionEndedCard, UpgradePlanCard } from '.'
import { Loading } from '../../common'
import { useUserContext } from '../../context'
import { getHostEventsAndPartners } from '../../gql/queries'
import { getIsSubPeriodOver } from '../../utils'

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    padding: theme.spacing(4, 0),
  },
}))

const CreatEvent = () => {
  const classes = useStyles()
  const { user } = useUserContext()
  const { id: user_id, role, sub_period_end } = user
  const [componentToShow, setComponentToShow] = useState('event-form')
  const [timeSinceSubEnded, setTimeSinceSubEnded] = useState(null)
  const userIsAPaidHost = role && (role.includes('starter') || role.includes('premium'))

  const { data: eventsData, loading: eventsLoading } = useQuery(getHostEventsAndPartners, {
    variables: {
      user_id,
    },
    skip: !user_id,
  })

  useEffect(() => {
    console.log('eventsData ->', eventsData)
    if (role && role === 'host' && eventsData && eventsData.events.length) {
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

  if (eventsLoading) {
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
        return <NewEventForm />
    }
  }

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      className={classes.pageContainer}
    >
      {renderComponentToShow()}
    </Grid>
  )
}

export default CreatEvent
