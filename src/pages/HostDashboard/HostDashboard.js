import React, { useState, useEffect } from 'react'

import Typography from '@material-ui/core/Typography'
import { useQuery } from '@apollo/react-hooks'
import { Redirect } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'

import { ExpansionPanel } from '@material-ui/core'
import { useAppContext } from '../../context/useAppContext'
import { HostMetricsSnapshot, HostEventsExpansionPanel } from '.'
import { FloatCardXLarge, FloatCardLarge, Loading } from '../../common'
import { getHostEventsAndRounds } from '../../gql/queries'

const useStyles = makeStyles((theme) => ({
  expansionPanelContent: {
    width: '75vw',
    margin: theme.spacing(0, 'auto'),
    [theme.breakpoints.down('md')]: {
      width: '85vw',
    },
  },
  noEventsContainer: {
    marginTop: '150px',
  },
  noEventsMessage: {
    textAlign: 'center',
    padding: theme.spacing(2, 0, 1, 0),
  },
  pageContainer: {
    marginTop: '100px',
    paddingLeft: '25px',
    paddingRight: '25px',
  },
  sectionHeader: {
    marginBottom: theme.spacing(3),
  },
}))

const HostDashboard = () => {
  const classes = useStyles()
  const { user, app } = useAppContext()
  const { userId, role } = user
  const { appLoading } = app
  const [allTimeRSVPed, setAllTimeRSVPed] = useState(0)
  const [allTimeMutualThumbs, setAllTimeMutualThumbs] = useState(0)
  const [avgThumbsPerEvent, setAvgThumbsPerEvent] = useState(0)

  const { data: eventsAndRoundsData, loading: eventsAndRoundsLoading } = useQuery(
    getHostEventsAndRounds,
    {
      variables: {
        userId: userId,
      },
      skip: !userId || (role && role !== 'host'),
    }
  )

  useEffect(() => {
    window.analytics.page('/host-dashbaord')
  }, [])

  useEffect(() => {
    // TODO: abstract to its own function that returns three variables
    // totalRSVP, totalThumbs, avgThumbs
    if (eventsAndRoundsData && !eventsAndRoundsLoading) {
      // calculate all the RSVPed people in all your events
      const totalRSVP = eventsAndRoundsData.events.reduce((total, event) => {
        total += event.event_users.length
        return total
      }, 0)

      // calcuate all the Mutual Thumbs in all your events
      const totalThumbs = eventsAndRoundsData.events.reduce((total, event) => {
        const mutualThumbsInEvent = event.rounds.reduce((thumbTotal, round) => {
          if (round.partnerY_thumb && round.partnerX_thumb) {
            thumbTotal += 1
          }
          return thumbTotal
        }, 0)
        total += mutualThumbsInEvent
        return total
      }, 0)

      // calculate average connections per event
      const averageThumbs = (totalThumbs / eventsAndRoundsData.events.length).toFixed(1)

      setAllTimeRSVPed(totalRSVP)
      setAllTimeMutualThumbs(totalThumbs)
      setAvgThumbsPerEvent(averageThumbs)
    }
  }, [eventsAndRoundsData, eventsAndRoundsLoading])

  if (role && role !== 'host') {
    return <Redirect to="/events" />
  }

  if (eventsAndRoundsLoading || appLoading) {
    return <Loading />
  }

  const hostHasEvents = eventsAndRoundsData && eventsAndRoundsData.events.length
  const hostHasCompletedEvents = eventsAndRoundsData.events.some(
    (event) => event.status === 'complete'
  )

  if (!hostHasEvents || !hostHasCompletedEvents) {
    return (
      <div className={classes.noEventsContainer}>
        <FloatCardLarge>
          <Typography variant="h4" className={classes.noEventsMessage}>
            Once you host some events we&rsquo;ll show you some data!
          </Typography>
          <Typography variant="h4" className={classes.noEventsMessage}>
            Come back when you have created and finished an event!
          </Typography>
        </FloatCardLarge>
      </div>
    )
  }

  const totalMetrics = [{ allTimeRSVPed, allTimeMutualThumbs, avgThumbsPerEvent }]

  return (
    <div className={classes.pageContainer}>
      <Typography variant="h4" className={classes.sectionHeader}>
        Your Progress as a Host:
      </Typography>
      <FloatCardXLarge>
        <HostMetricsSnapshot totalMetrics={totalMetrics} />
      </FloatCardXLarge>
      <Typography variant="h4" className={classes.sectionHeader}>
        Your Past Events:
      </Typography>
      <div className={classes.expansionPanelContent}>
        <HostEventsExpansionPanel eventsAndRoundsData={eventsAndRoundsData} />
      </div>
    </div>
  )
}

export default HostDashboard
