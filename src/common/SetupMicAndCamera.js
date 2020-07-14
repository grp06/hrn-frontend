import React, { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'

import { useAppContext } from '../context/useAppContext'
import cameraBlocked from '../assets/cameraBlocked.png'

const useStyles = makeStyles((theme) => ({
  permissionsContainer: {
    minHeight: '50vh',
  },
  cameraBlocked: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '50%',
    background: `url("${cameraBlocked}")`,
    backgroundPosition: 'top center',
  },
  blockedText: {
    position: 'fixed',
    bottom: '40%',
    width: '100%',
  },
  animatedItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: theme.spacing(1),
    animationName: '$myEffect',
    animationDuration: '.75s',
    animationTimingFunction: 'linear',
    animationIterationCount: '1',
  },
  '@keyframes myEffect': {
    '0%': {
      opacity: 0,
    },
    '90%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
}))

const SetupMicAndCamera = () => {
  const classes = useStyles()
  const { setCameraAndMicPermissions } = useAppContext()
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [permissionNotYetAllowed, setPermissionNotYetAllowed] = useState(true)
  useEffect(() => {
    const getMedia = async (constraints) => {
      let localMediaStream = null

      try {
        localMediaStream = await navigator.mediaDevices.getUserMedia(constraints)
        const video = document.querySelector('#videoElement')
        video.style.maxWidth = '75%'
        setPermissionDenied(false)
        setPermissionNotYetAllowed(false)
        setCameraAndMicPermissions({
          hasWebcam: true,
          hasMicrophone: true,
          isMicrophoneAlreadyCaptured: true,
          isWebcamAlreadyCaptured: true,
        })
        video.srcObject = localMediaStream

        video.onloadedmetadata = function (e) {
          console.log('video.onloadedmetadata -> e', e)
          // Do something with the video here.
        }
      } catch (error) {
        console.warn('error - ', error)
        setPermissionDenied(true)
        setPermissionNotYetAllowed(false)
        // if (err === 'PERMISSION_DENIED') {
        //   // Explain why you need permission and how to update the permission setting
        // }
      }
    }
    getMedia({ video: true, audio: true })
  }, [])

  const getPermissionDenied = () => {
    if (permissionDenied) {
      return (
        <div className={classes.cameraBlocked}>
          <Grid container justify="center" direction="column" className={classes.blockedText}>
            <Typography>Your camera or mic is blocked</Typography>
            <Typography>
              To unblock - click the &quot;camera blocked&quot; icon in the address bar
            </Typography>
            <Typography>Allow access, then refresh the page</Typography>
          </Grid>
        </div>
      )
    }
  }

  const getPermissionNotYetAllowed = () => {
    if (permissionNotYetAllowed) {
      return <div>Choose &quot;Allow&quot; to continue</div>
    }
  }

  const getDamnYouLookGood = () => {
    return (
      !permissionNotYetAllowed &&
      !permissionDenied && (
        <Typography className={classes.animatedItem} variant="h2">
          Damn
          <span
            style={{ margin: '0px 10px', fontSize: 40 }}
            role="img"
            aria-label="woozy face emoji"
          >
            🤩
          </span>
          You look good.
        </Typography>
      )
    )
  }

  return (
    <Grid
      className={classes.permissionsContainer}
      container
      direction="column"
      justify="flex-start"
    >
      <Grid item>
        {getDamnYouLookGood()}
        <video autoPlay id="videoElement" muted />
        {getPermissionDenied()}
        {getPermissionNotYetAllowed()}
      </Grid>
    </Grid>
  )
}
export default SetupMicAndCamera
