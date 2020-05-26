import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useGetRoomId } from '../hooks'
import { useGameContext } from '../context/useGameContext'

const width = window.innerWidth
const height = window.innerHeight
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
  const { currentRound, twilioReady, waitingRoom, roomId } = useGameContext()
  const { setToken } = useGetRoomId()

  useEffect(() => {
    if (roomId) {
      setToken()
    }
  }, [roomId])

  const notReady = () => {
    // turn into components
    if (currentRound === 0) {
      return (
        <div className={classes.notReady}>
          <h1>{waitingRoom ? 'waiting room' : 'Please wait for event to begin'}</h1>
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
