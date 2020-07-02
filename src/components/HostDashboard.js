import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { useQuery } from '@apollo/react-hooks'
import { Redirect } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'
import {
  FloatCardXLarge,
  FloatCardLarge,
  Loading,
  HostMetricsSnapshot,
  HostEventsExpansionPanel,
} from '../common'
import { getHostEventsAndRounds } from '../gql/queries'

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    marginTop: '100px',
    paddingLeft: '25px',
    paddingRight: '25px',
  },
  sectionHeader: {
    ...theme.typography.h2,
    color: theme.palette.common.ghostWhite,
    marginBottom: '25px',
  },
  noEventsContainer: {
    marginTop: '150px',
  },
  noEventsMessage: {
    ...theme.typography.h2,
    textAlign: 'center',
    paddingTop: '20px',
    paddingBottom: '10px',
  },
}))

const HostDashboard = () => {
  const classes = useStyles()
  const { user } = useAppContext()
  const { userId, role } = user
  const [allTimeRSVPed, setAllTimeRSVPed] = useState(0)
  const [allTimeMutualThumbs, setAllTimeMutualThumbs] = useState(0)
  const [avgThumbsPerEvent, setAvgThumbsPerEvent] = useState(0)

  const { data: eventsAndRoundsData, loading: eventsAndRoundsLoading } = useQuery(
    getHostEventsAndRounds,
    {
      variables: {
        userId: userId,
      },
      skip: !userId,
    }
  )

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
            thumbTotal++
          }
          return thumbTotal
        }, 0)
        total += mutualThumbsInEvent
        return total
      }, 0)

      // calculate average connections per event
      // we round up because why not ;)
      const averageThumbs = (totalThumbs / eventsAndRoundsData.events.length).toFixed(1)

      setAllTimeRSVPed(totalRSVP)
      setAllTimeMutualThumbs(totalThumbs)
      setAvgThumbsPerEvent(averageThumbs)
    }
  }, [eventsAndRoundsData, eventsAndRoundsLoading])

  if (role !== 'host') {
    return <Redirect to="/events" />
  }

  if (eventsAndRoundsLoading) {
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
          <Typography className={classes.noEventsMessage}>
            Sorry, but you need to host some events for us to provide you with some data! 😩
          </Typography>
          <Typography className={classes.noEventsMessage}>
            Come back when you have created and finished an event!
          </Typography>
        </FloatCardLarge>
      </div>
    )
  }

  const totalMetrics = [{ allTimeRSVPed, allTimeMutualThumbs, avgThumbsPerEvent }]

  return (
    <div className={classes.pageContainer}>
      <Typography className={classes.sectionHeader}>Your Progress as a Host:</Typography>
      <FloatCardXLarge>
        <HostMetricsSnapshot totalMetrics={totalMetrics} />
      </FloatCardXLarge>
      <Typography className={classes.sectionHeader}>Your Past Events:</Typography>
      <FloatCardLarge>
        <HostEventsExpansionPanel eventsAndRoundsData={eventsAndRoundsData} />
      </FloatCardLarge>
    </div>
  )
}

export default HostDashboard
