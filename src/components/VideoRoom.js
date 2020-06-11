import React, { useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import moment from 'moment-timezone'
import { useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { getMyRoundById } from '../gql/queries'

import { WaitingRoom } from '.'
import { Timer } from '../common'
import { useAppContext } from '../context/useAppContext'
import { useEventContext } from '../context/useEventContext'
import { useTwilio } from '../hooks'
import { constants } from '../utils'

const { roundLength } = constants

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

const VideoRoom = () => {
  const classes = useStyles()
  const { app, user } = useAppContext()
  const { event } = useEventContext()
  const { userId } = user
  const { id: eventId, current_round } = event
  const { startTwilio } = useTwilio()
  const [showTimer, setShowTimer] = useState(false)
  const [timerTimeInput, setTimerTimeInput] = useState('')

  const history = useHistory()

  const { data: myRoundData, loading: myRoundDataLoading, error: myRoundDataError } = useQuery(
    getMyRoundById,
    {
      variables: {
        round_number: current_round,
        user_id: userId,
      },
      skip: !userId,
    }
  )

  const myRound = myRoundData.rounds[0]

  // useEffect(() => {
  //   const { myRound } = state
  //   const hasPartner = myRound && myRound.partnerX_id && myRound.partnerY_id
  //   if (!state.room && state.roomId && hasPartner) {
  //     const getTwilioToken = async () => {
  //       const token = await getToken(state.roomId, state.userId).then((response) => response.json())
  //       dispatch((draft) => {
  //         draft.token = token.token
  //       })
  //     }
  //     getTwilioToken()
  //   }
  // }, [state.roomId, state.room, myRoundData])

  // useEffect(() => {
  //   if (room) {
  //     const eventEndTimeSeconds = moment(myRound.started_at).seconds()
  //     const eventEndTime = moment(myRound.started_at).seconds(eventEndTimeSeconds + roundLength)

  //     setTimerTimeInput(eventEndTime)
  //     setShowTimer(true)
  //     startTwilio()
  //   }
  // }, [room])

  useEffect(() => {
    if (current_round === 0) {
      history.push('/events')
    }
  }, [current_round])

  return (
    <div>
      <WaitingRoom />
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
      </div>
    </div>
  )
}

export default VideoRoom
