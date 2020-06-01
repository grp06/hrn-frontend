import React, { useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useGameContext } from '../context/useGameContext'
import { useGetRoomId } from '../hooks'
import { Connecting } from '.'

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

const VideoRoom = () => {
  const classes = useStyles()
  const { twilioReady, room, roomId } = useGameContext()
  const { setToken } = useGetRoomId()

  useEffect(() => {
    if (!room && roomId) {
      console.log('VideoRoom -> room', room)
      console.log('VideoRoom -> roomId', roomId)

      setToken()
    }
  }, [roomId, room])

  return (
    <div>
      <Connecting />
      <div className={classes.videoWrapper}>
        <div id="local-video" className={classes.myVideo} />
        <div id="remote-video" className={classes.mainVid} />
      </div>
    </div>
  )
}

export default VideoRoom
