import React, { useEffect, useState } from 'react'

import { useSubscription, useQuery } from '@apollo/react-hooks'

import { EventForm, AdminControl, UserControl, Loading } from '../common'
import { makeStyles } from '@material-ui/styles'
import { Typography, Grid } from '@material-ui/core'
import { useGameContext } from '../context/useGameContext'
import { listenToRounds } from '../gql/subscriptions'
import { getEvent } from '../gql/queries'
import bannerBackground from '../assets/eventBannerMountain.png'
import formatDate from '../utils/formatDate'
import ScheduleIcon from '@material-ui/icons/Schedule'
import { PreEvent } from '.'

const useStyles = makeStyles((theme) => ({
  eventBanner: {
    width: '100%',
    height: '45vh',
    paddingBottom: '80px',
    backgroundImage: 'url(' + bannerBackground + ')',
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    zIndex: '-2',
  },
  eventBannerContentContainer: {
    marginLeft: '30px',
  },
  eventTitle: {
    ...theme.typography.h1,
  },
  scheduleIcon: {
    color: theme.palette.common.ghostWhite,
  },
  subtitle: {
    marginLeft: '5px',
  },
}))

const Event = ({ match }) => {
  const { id: eventId } = match.params
  const classes = useStyles()
  const {
    appLoading,
    setGameData,
    currentRound,
    resetUserState,
    userId,
    roundsData,
  } = useGameContext()
  // decoding thing here
  const { data: eventData, loading: eventLoading, error: eventError } = useQuery(getEvent, {
    variables: {
      id: eventId,
    },
  })

  const {
    data: freshRoundsData,
    loading: roundDataLoading,
    error: roundDataError,
  } = useSubscription(listenToRounds, {
    variables: {
      eventId: eventId,
    },
  })

  const hasSubscriptionData = freshRoundsData && freshRoundsData.rounds
  const hostId = eventData && eventData.events[0].host_id

  useEffect(() => {
    if (freshRoundsData && freshRoundsData.rounds.length === 0 && currentRound === 0) {
      return resetUserState()
    }
  }, [freshRoundsData, currentRound])

  useEffect(() => {
    if (hasSubscriptionData) {
      if (!roundsData || !roundsData.rounds.length) {
        return setGameData(freshRoundsData, userId)
      }

      const roundsDataLength = roundsData.rounds.length
      const freshRoundsDataLength = freshRoundsData.rounds.length
      const newRoundsData = freshRoundsDataLength > roundsDataLength
      const adminIsResettingGame = freshRoundsDataLength < roundsDataLength

      if (newRoundsData || adminIsResettingGame) {
        return setGameData(freshRoundsData, userId)
      }
    }
  }, [freshRoundsData, hasSubscriptionData])

  if (roundDataError) {
    console.log('roundDataError - ', roundDataError)
    return <div>Looks like we hit a hiccup. Please refresh your browser.</div>
  }

  if (appLoading) {
    return <Loading />
  }
  // probably need to move this into useEffect
  if (eventData) {
    const event = eventData.events[0]
    console.log('event is.. ', event)
    const startTime = new Date(event.start_at).getTime()
    const eventTime = formatDate(startTime)
    console.log('start time', startTime)
    const now = Date.now()
    const within30minutes = startTime - now <= 1800000
    return (
      <>
        <Grid container direction="column" justify="flex-end" className={classes.eventBanner}>
          <Grid item container direction="column" className={classes.eventBannerContentContainer}>
            <Typography className={classes.eventTitle}>{event.event_name}</Typography>
            <Grid item container direction="row" alignItems="center">
              <ScheduleIcon className={classes.scheduleIcon} />
              <Typography className={classes.subtitle} variant="subtitle1">
                {eventTime}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {hostId === userId && currentRound === 0 ? (
          <AdminControl within30minutes={within30minutes} eventData={eventData} />
        ) : (
          <UserControl within30minutes={within30minutes} />
        )}
      </>
    )
  }

  return <></>
}

export default Event
