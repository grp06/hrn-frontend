import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import moment from 'moment-timezone'
import { Connecting } from '.'
import { Timer } from '../common'
import { useTwilio } from '../hooks'
import { useGameContext } from '../context/useGameContext'

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
  const { room, myRound } = useGameContext()
  const { startTwilio } = useTwilio()
  const [timerTimeInput, setTimerTimeInput] = useState('')

  useEffect(() => {
    if (room) {
      const eventEndTimeSeconds = moment(myRound.started_at).seconds()
      const eventEndTime = moment(myRound.started_at).seconds(eventEndTimeSeconds + 30)
      setTimerTimeInput(eventEndTime)
      startTwilio()
    }
  }, [room])

  return (
    <div>
      <Connecting />
      <div className={classes.videoWrapper}>
        <div id="local-video" className={classes.myVideo} />
        <div id="remote-video" className={classes.mainVid} />
        {timerTimeInput ? (
          <Grid
            container
            justify="center"
            alignItems="center"
            id="timer"
            className={classes.timerContainer}
          >
            <Timer eventStartTime={timerTimeInput} subtitle="Next Person In:" />
          </Grid>
        ) : null}
      </div>
    </div>
  )
}

export default VideoRoom
