import React, { useEffect, useRef } from 'react'
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
  const { currentRound, twilioReady, waitingRoom, roomId, room } = useGameContext()
  const { setToken } = useGetRoomId()
  const mounted = useRef()

  useEffect(() => {
    if (!mounted.current && roomId) {
      mounted.current = roomId
      console.log('setting mounted.current for the first time')
      setToken()
    } else if (roomId !== mounted.current) {
      console.log('replacing mounted.current')
      mounted.current = roomId
      setToken()
    }
  }, [roomId, room])

  const notReady = () => {
    if (waitingRoom) {
      return (
        <div className={classes.notReady}>
          <h1>waiting room</h1>
        </div>
      )
    }

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
