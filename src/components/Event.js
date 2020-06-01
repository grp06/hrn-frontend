import React, { useEffect } from 'react'

import { useSubscription, useQuery } from '@apollo/react-hooks'

import { makeStyles } from '@material-ui/styles'
import { Typography, Grid } from '@material-ui/core'
import ScheduleIcon from '@material-ui/icons/Schedule'
import { EventForm, AdminPanel, UserPanel, Loading } from '../common'
import { useGameContext } from '../context/useGameContext'
import { listenToRounds } from '../gql/subscriptions'
import { getEventById } from '../gql/queries'
import bannerBackground from '../assets/eventBannerMountain.png'

import formatDate from '../utils/formatDate'

const useStyles = makeStyles((theme) => ({
  bannerGradient: {
    background: ' rgb(25,25,25)',
    background:
      'linear-gradient(0deg, rgba(25,25,25,1) 0%, rgba(0,0,0,0) 58%, rgba(0,212,255,0) 100%)',
    width: '100%',
    height: '100%',
  },
  eventBanner: {
    width: '100%',
    height: '45vh',
    backgroundImage: `url(${bannerBackground})`,
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    zIndex: '-3',
    marginBottom: '80px',
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
    roomId,
  } = useGameContext()
  // decoding thing here
  const { data: eventData, loading: eventDataLoading, error: eventError, refetch } = useQuery(
    getEventById,
    {
      variables: {
        event_id: eventId,
      },
    }
  )

  const {
    data: freshRoundsData,
    loading: roundDataLoading,
    error: roundDataError,
  } = useSubscription(listenToRounds, {
    variables: {
      event_id: eventId,
    },
  })

  console.log('the freshestttt rounds data = ', freshRoundsData)

  const hasSubscriptionData = freshRoundsData && freshRoundsData.rounds
  const hostId = eventData && eventData.events[0].host_id

  useEffect(() => {
    if (freshRoundsData && freshRoundsData.rounds.length === 0 && currentRound === 0) {
      return resetUserState()
    }
  }, [freshRoundsData, currentRound])

  useEffect(() => {
    if (hasSubscriptionData) {
      console.log('Event -> freshRoundsData', freshRoundsData)

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
    return <div>Looks like we hit a hiccup. Please refresh your browser.</div>
  }

  if (appLoading || roundDataLoading || eventDataLoading) {
    return <Loading />
  }

  // probably need to move this into useEffect
  if (eventData) {
    const event = eventData.events[0]
    const startTime = new Date(event.start_at).getTime()
    const eventTime = formatDate(startTime)
    const now = Date.now()
    const diff = startTime - now
    const timeState = () => {
      if (diff > 1800000) {
        return 'future'
      }
      if (diff < 0) {
        return 'go time'
      }
      return 'within 30 mins'
    }

    return (
      <>
        <div className={classes.eventBanner}>
          <Grid container direction="column" justify="flex-end" className={classes.bannerGradient}>
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
        </div>
        {hostId === userId ? (
          <AdminPanel timeState={timeState()} eventData={eventData} />
        ) : (
          <UserPanel timeState={timeState()} eventData={eventData} refetch={refetch} />
        )}
      </>
    )
  }

  return <></>
}

export default Event
