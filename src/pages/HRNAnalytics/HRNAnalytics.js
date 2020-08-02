import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/styles'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { getAllUsers, getAllEvents } from '../../gql/queries'
import { Loading } from '../../common'
import { EventExpansionPanelAdmin } from '.'

const useStyles = makeStyles((theme) => ({
  expansionPanelsContainer: {
    width: '75vw',
    margin: theme.spacing(0, 'auto'),
  },
  pageContainer: {
    marginTop: '200px',
  },
  systemNumbersSnapshotContainer: {
    width: '50vw',
    margin: theme.spacing(0, 'auto', 5, 'auto'),
  },
}))

const HRNAnalytics = () => {
  const classes = useStyles()
  const { data: allDBUsers, loading: allDBUsersLoading } = useQuery(getAllUsers)
  const { data: allDBEventsAndRounds, loading: allDBEventsAndRoundsLoading } = useQuery(
    getAllEvents
  )
  if (allDBUsersLoading || allDBEventsAndRoundsLoading) {
    return <Loading />
  }

  return (
    <div className={classes.pageContainer}>
      <Grid
        container
        justify="space-around"
        alignItems="center"
        className={classes.systemNumbersSnapshotContainer}
      >
        <Grid container direction="column" justify="center" alignItems="center" md={6}>
          <Typography variant="subtitle1">Number of total users:</Typography>
          <Typography variant="h2">{allDBUsers.users.length}</Typography>
        </Grid>
        <Grid container direction="column" justify="center" alignItems="center" md={6}>
          <Typography variant="subtitle1">Number of total events:</Typography>
          <Typography variant="h2">{allDBEventsAndRounds.events.length}</Typography>
        </Grid>
      </Grid>
      <div className={classes.expansionPanelsContainer}>
        <EventExpansionPanelAdmin eventsAndRoundsData={allDBEventsAndRounds} />
      </div>
    </div>
  )
}

export default HRNAnalytics
