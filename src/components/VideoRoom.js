import React, { useEffect, useState, useRef } from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import moment from 'moment-timezone'
import { useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { getMyRoundById } from '../gql/queries'
import { Loading, Timer, GUMErrorModal } from '../common'
import { getToken } from '../helpers'
import { constants } from '../utils'

import { VideoRouter } from '.'

import { useAppContext } from '../context/useAppContext'
import { useTwilio } from '../hooks'

const { createLocalTracks, connect } = require('twilio-video')

const useStyles = makeStyles((theme) => ({
  videoWrapper: {
    background: theme.palette.common.blackBody,
  },
  mainVid: {
    width: '100%',
    display: 'flex',
    '& video': {
      width: '100%',
      height: 'calc(100vh)',
    },
  },
  myVideo: {
    width: '150px',
    position: 'absolute',
    top: '79px',
    right: '15px',
    zIndex: 99,

    '& video': {
      borderRadius: 4,
      width: '150px',
    },
  },
  timerContainer: {
    position: 'fixed',
    left: 0,
    top: 'auto',
    right: 'auto',
    bottom: 0,
    width: '200px',
    height: '150px',
  },
  partnerNameContainer: {
    position: 'fixed',
    left: 'auto',
    top: 'auto',
    right: 'auto',
    bottom: '0%',
    width: '100vw',
    height: '150px',
  },
  partnerName: {
    fontFamily: 'Muli',
    fontSize: '2rem',
    color: theme.palette.common.ghostWhite,
  },
  notReady: {
    position: 'fixed',
    width: '100%',
    height: 'calc(100vh - 64px)',
    top: '64px',
    background: '#111',
    zIndex: 9,
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Muli',
  },
}))

const VideoRoom = ({ match }) => {
  const { id: eventId } = match.params
  const classes = useStyles()

  const { roundLength } = constants

  const { app, user, event, setLateArrival } = useAppContext()
  const { userId } = user
  const { appLoading } = app

  const { startTwilio, twilioStarted } = useTwilio()

  const [showTimer, setShowTimer] = useState(false)
  const [timerTimeInput, setTimerTimeInput] = useState('')
  const [token, setToken] = useState(null)
  const [myRound, setMyRound] = useState(null)
  const [room, setRoom] = useState(null)
  const [GUMError, setGUMError] = useState('')
  const [isGUMErrorModalActive, setIsGUMErrorModalActive] = useState(false)

  const history = useHistory()
  const eventSet = Object.keys(event).length > 1
  const eventStatus = useRef()

  const { data: myRoundData, loading: myRoundDataLoading, error: myRoundDataError } = useQuery(
    getMyRoundById,
    {
      variables: {
        round_number: event.current_round,
        user_id: userId,
      },
      skip: !userId || !eventSet || (eventStatus && eventStatus.current === 'in-between-rounds'),
    }
  )

  // Redirect back to /event/id if the event has not started
  useEffect(() => {
    if (eventSet) {
      const { status } = event

      if (!userId) {
        history.push('/')
      }
      if (status === 'not-started') {
        return history.push(`/events/${eventId}`)
      }

      // we will hit this when the user is on the Thumbing screen, then new assignments are made
      // and there are no new pairings left, and we end the event
      if (status === 'complete') {
        return history.push(`/events/${eventId}/event-complete`)
      }
    }
  }, [event, userId])

  // After the getMyRoundById, if there is a response, setMyRound
  useEffect(() => {
    if (!myRoundDataLoading && myRoundData) {
      // if you're on this page and you don't have roundData --- youre late!
      if (!myRoundData.rounds.length) {
        setLateArrival(true)
      } else {
        setMyRound(myRoundData.rounds[0])
        setLateArrival(false)
      }
    }
  }, [myRoundDataLoading, myRoundData])

  // After getting myRound from the query above, we get the twilio token
  // RoomId (which is the id of your round) and your userId are needed
  // to get twilio token
  useEffect(() => {
    const hasPartner = myRound && myRound.partnerX_id && myRound.partnerY_id
    if (hasPartner && eventSet && event.status !== 'in-between-rounds' && !twilioStarted) {
      const getTwilioToken = async () => {
        console.log('getTwilioToken -> eventId', eventId)
        const res = await getToken(`${eventId}-${myRound.id}`, userId).then((response) =>
          response.json()
        )
        console.warn('setting token to something long')

        setToken(res.token)
      }
      getTwilioToken()
    }
  }, [myRound])

  // After getting your token you get the permissions and create localTracks
  // You also get your room
  useEffect(() => {
    if (token) {
      const setupRoom = async () => {
        let localTracks
        try {
          localTracks = await createLocalTracks({
            video: true,
            audio: false,
          })
        } catch (err) {
          setGUMError(err.name)
          return setIsGUMErrorModalActive(true)
        }

        const myRoom = await connect(token, {
          tracks: localTracks,
        })

        setRoom(myRoom)
      }
      setupRoom()
    }
  }, [token])

  // After getting a room, we set the timer
  useEffect(() => {
    if (room) {
      const roundStartedAtInSeconds = moment(myRound.started_at).seconds()
      const roundEndTime = moment(myRound.started_at).seconds(roundStartedAtInSeconds + roundLength)
      setTimerTimeInput(roundEndTime)
      setShowTimer(true)
      console.warn('starting twilio')

      startTwilio(room)
    }
  }, [room])

  if (appLoading || !eventSet) {
    return <Loading />
  }

  const showPartnersName = () => {
    let userIsPartnerX = false
    const hasPartner = myRound ? myRound && myRound.partnerX_id && myRound.partnerY_id : null
    if (!myRound || event.status !== 'room-in-progress' || !hasPartner) {
      return null
    }

    if (parseInt(userId, 10) === parseInt(myRound.partnerX_id, 10)) {
      userIsPartnerX = true
    }
    return (
      <Grid container justify="center" alignItems="center" className={classes.partnerNameContainer}>
        <Typography className={classes.partnerName}>
          {userIsPartnerX ? myRound.partnerY.name : myRound.partnerX.name}
        </Typography>
      </Grid>
    )
  }

  // If you are switching from room-in-progress to in-between-rounds
  // then we want to clear your room and token
  const { status: latestStatus } = event
  if (latestStatus !== eventStatus.current) {
    if (latestStatus === 'room-in-progress' && eventStatus.current === 'in-between-rounds') {
      console.warn('setting token, room, round to null')
      setToken(null)
      setRoom(null)
      eventStatus.current = latestStatus
      return null
    }
    eventStatus.current = latestStatus
  }

  return eventStatus.current === latestStatus ? (
    <div>
      {isGUMErrorModalActive && (
        <GUMErrorModal onComplete={() => setIsGUMErrorModalActive(false)} errorName={GUMError} />
      )}
      <VideoRouter myRound={myRound} />
      <div className={classes.videoWrapper}>
        <div id="local-video" className={classes.myVideo} />
        <div id="remote-video" className={classes.mainVid} />
        {showTimer ? (
          <Grid
            container
            justify="center"
            alignItems="center"
            id="timer-container"
            className={classes.timerContainer}
          >
            <Timer
              eventStartTime={timerTimeInput}
              onRoundComplete={() => {
                setShowTimer(false)
              }}
            />
          </Grid>
        ) : null}
        {showPartnersName()}
      </div>
    </div>
  ) : null
}

export default VideoRoom
