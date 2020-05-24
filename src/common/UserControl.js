import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useTwilio } from '../hooks'

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
    width: '200px',
    position: 'absolute',
    top: '15px',
    right: '15px',
    '& video': {
      borderRadius: 15,
      width: '300px',
    },
  },
}))

const UserControl = () => {
  const classes = useStyles()
  const { twilioReady } = useTwilio()

  return (
    <div>
      <div className={classes.videoWrapper}>
        <div id="local-video" className={classes.myVideo} />
        <div id="remote-media-div" className={classes.mainVid} />
      </div>
    </div>
  )
}
export default UserControl
