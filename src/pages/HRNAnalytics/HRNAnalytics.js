import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/styles'

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
  // the number of users we have in the db
  console.log(allDBUsers.users.length)
  console.log(allDBEventsAndRounds)
  return (
    <div className={classes.pageContainer}>
      <div className={classes.expansionPanelsContainer}>
        <EventExpansionPanelAdmin eventsAndRoundsData={allDBEventsAndRounds} />
      </div>
    </div>
  )
}

export default HRNAnalytics
