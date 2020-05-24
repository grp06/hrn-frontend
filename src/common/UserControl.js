import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useTwilio } from '../hooks'
import { useGameContext } from '../context/useGameContext'

const width = window.innerWidth
const height = window.innerHeight
const useStyles = makeStyles((theme) => ({
  videoWrapper: {
    position: 'fixed',
    width: '100%',
    height: 'calc(100vh - 64px)',
    top: '64px',
    background: '#111',
  },
  mainVid: {
    width: '100%',
    display: 'flex',
    '& video': {
      margin: '0 auto',
      width: '100%',
      height: '100vh',
    },
  },
  myVideo: {
    width: '300px',
    position: 'absolute',
    top: '15px',
    right: '15px',
    '& video': {
      borderRadius: 15,
      width: '300px',
    },
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

const UserControl = () => {
  const classes = useStyles()
  const { currentRound } = useGameContext()

  // still need to implement this
  // if there's no room available, show "waiting for event to start"
  // problem is - if you render that INSTEAD of local-video, we cant
  // append local-video ...
  const { twilioReady } = useTwilio()
  console.log('twilioReady = ', twilioReady)
  const notReady = () => {
    if (currentRound === 0) {
      return (
        <div className={classes.notReady}>
          <h1>Please wait for event to begin</h1>
        </div>
      )
    }
    if (!twilioReady) {
      return (
        <div className={classes.notReady}>
          <h1>Connecting...</h1>
        </div>
      )
    }
    return null
  }
  return (
    <div>
      {notReady()}
      <div className={classes.videoWrapper}>
        <div id="local-video" className={classes.myVideo} />
        <div id="remote-video" className={classes.mainVid} />
      </div>
    </div>
  )
}
export default UserControl
