import React, { useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import moment from 'moment-timezone'
import { useHistory } from 'react-router-dom'

import { WaitingRoom } from '.'
import { Timer } from '../common'
import { useGameContext } from '../context/useGameContext'
import { useTwilio } from '../hooks'
import { constants } from '../utils'

const { roundLength } = constants

const useStyles = makeStyles((theme) => ({
  videoWrapper: {
    background: '#111',
  },
  mainVid: {
    width: '100%',
    display: 'flex',
    '& video': {
      margin: '0 auto',
      width: '100%',
      height: 'calc(100vh - 64px)',
    },
  },
  myVideo: {
    width: '300px',
    position: 'absolute',
    top: '79px',
    right: '15px',
    zIndex: 99,

    '& video': {
      borderRadius: 10,
      width: '300px',
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
  const { room, myRound, currentRound } = useGameContext()
  const { startTwilio } = useTwilio()
  const [showTimer, setShowTimer] = useState(false)
  const [timerTimeInput, setTimerTimeInput] = useState('')

  const history = useHistory()

  useEffect(() => {
    if (room) {
      console.log('hitting the use effect')
      const eventEndTimeSeconds = moment(myRound.started_at).seconds()
      const eventEndTime = moment(myRound.started_at).seconds(eventEndTimeSeconds + roundLength)
      console.log('use effect video room')
      console.log('timer Time Input ****', timerTimeInput)
      setTimerTimeInput(eventEndTime)

      setShowTimer(true)
      startTwilio()
    }
    return () => {
      console.log('VideoRoom Cleanup ******')
      // document.getElementById('timer-container').innerHTML()
      // setShowTimer(false)
      // setTimerTimeInput(moment())
    }
  }, [room])

  useEffect(() => {
    if (currentRound === 0) {
      history.push('/events')
    }
  }, [currentRound])

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
              subtitle="New Person In:"
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
