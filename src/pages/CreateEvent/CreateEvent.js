import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useQuery } from 'react-apollo'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'

import { NewEventForm, UpgradePlanCard } from '.'
import { Loading } from '../../common'
import { useUserContext } from '../../context'
import { getHostEventsAndPartners } from '../../gql/queries'

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    padding: theme.spacing(4, 0),
  },
}))

const CreatEvent = () => {
  const classes = useStyles()
  const { user } = useUserContext()
  const { id: user_id, role } = user
  const [componentToShow, setComponentToShow] = useState('event-form')

  const { data: eventsData, loading: eventsLoading } = useQuery(getHostEventsAndPartners, {
    variables: {
      user_id,
    },
    skip: !user_id,
  })

  useEffect(() => {
    if (role && role === 'host' && eventsData && eventsData.events.length) {
      setComponentToShow('upgrade-plan')
    }
  }, [eventsData, role])

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
