import React, { useEffect, useState } from 'react'

import { Grid, Typography, FormControl, InputLabel, Select } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useEventContext } from '../../context'
import cameraBlocked from '../../assets/cameraBlocked.png'

const useStyles = makeStyles((theme) => ({
  permissionsContainer: {
    minHeight: '60vh',
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
  selectWrapper: {
    width: '50%',
    margin: '0 auto',
  },
  selectBox: {
    margin: theme.spacing(0.5, 0),
  },
}))

const SetupMicAndCamera = () => {
  const classes = useStyles()
  const { setCameraAndMicPermissions } = useEventContext()
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [permissionNotYetAllowed, setPermissionNotYetAllowed] = useState(true)
  const [videoDevices, setVideoDevices] = useState([])
  const [audioDevices, setAudioDevices] = useState([])
  const [currentVideoDeviceId, setCurrentVideoDeviceId] = useState('')
  const [currentAudioDeviceId, setCurrentAudioDeviceId] = useState('')

  const getDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    console.log(devices)
    const availableVideoDevices = devices.filter((device) => device.kind === 'videoinput')
    const availableAudioDevices = devices.filter((device) => device.kind === 'audioinput')
    setVideoDevices(availableVideoDevices)
    setAudioDevices(availableAudioDevices)

    const localStoragePreferredVideoId = localStorage.getItem('preferredVideoId')
    const localStoragePreferredAudioId = localStorage.getItem('preferredAudioId')

    if (availableVideoDevices.length) {
      if (
        !localStoragePreferredVideoId ||
        !availableVideoDevices.find((device) => device.deviceId === localStoragePreferredVideoId)
      ) {
        localStorage.setItem('preferredVideoId', availableVideoDevices[0].deviceId)
        setCurrentVideoDeviceId(availableVideoDevices[0].deviceId)
      } else {
        setCurrentVideoDeviceId(localStoragePreferredVideoId)
      }
    }

    if (availableAudioDevices.length) {
      if (
        !localStoragePreferredAudioId ||
        !availableAudioDevices.find((device) => device.deviceId === localStoragePreferredAudioId)
      ) {
        localStorage.setItem('preferredAudioId', availableAudioDevices[0].deviceId)
        setCurrentAudioDeviceId(availableAudioDevices[0].deviceId)
      } else {
        setCurrentAudioDeviceId(localStoragePreferredAudioId)
      }
    }
  }

  navigator.mediaDevices.ondevicechange = () => {
    getDevices()
  }

  useEffect(() => {
    getDevices()
  }, [])

  useEffect(() => {
    const getMedia = async (constraints) => {
      let localMediaStream = null

      try {
        localMediaStream = await navigator.mediaDevices.getUserMedia(constraints)
        console.log('getMedia -> localMediaStream', localMediaStream)
        const video = document.getElementById('videoElement')
        video.style.maxWidth = '50%'
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
          const localVideo = document.getElementsByTagName('video')[0]
          console.log('video.onloadedmetadata -> localVideo', localVideo)
          localVideo.srcObject = localMediaStream
          console.log('video.onloadedmetadata -> localVideo', localVideo)
          // if (localVideo) {
          //   localVideo.innerHTML = ''
          // }
          // const newVideoElement = document.createElement('video')
          // newVideoElement.srcObject = localMediaStream
          // localVideo.append(newVideoElement)
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
    getMedia({
      video: { deviceId: currentVideoDeviceId },
      audio: { deviceId: currentAudioDeviceId },
    })
  }, [currentVideoDeviceId, currentAudioDeviceId])

  const getPermissionDenied = () => {
    if (permissionDenied) {
      return (
        <div className={classes.cameraBlocked}>
          <Grid container justify="center" direction="column" className={classes.blockedText}>
            <Typography variant="h5">Your camera or mic is blocked</Typography>
            <Typography variant="h5">
              To unblock - click the &quot;camera blocked&quot; icon in the address bar
            </Typography>
            <Typography variant="h5">Allow access, then refresh the page</Typography>
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
        <Typography variant="h5" className={classes.animatedItem}>
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

  const handleVideoDeviceChange = (event) => {
    localStorage.setItem('preferredVideoId', event.target.value)
    setCurrentVideoDeviceId(event.target.value)
  }

  const handleAudioDeviceChange = (event) => {
    localStorage.setItem('preferredAudioId', event.target.value)
    setCurrentAudioDeviceId(event.target.value)
  }

  const getMediaControl = () => {
    return (
      !permissionNotYetAllowed &&
      !permissionDenied && (
        <Grid
          container
          direction="column"
          justify="space-between"
          alignItems="center"
          className={classes.selectWrapper}
        >
          <FormControl fullWidth className={classes.selectBox}>
            <InputLabel>Camera</InputLabel>
            <Select native value={currentVideoDeviceId} onChange={handleVideoDeviceChange}>
              {videoDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth className={classes.selectBox}>
            <InputLabel>Microphone</InputLabel>
            <Select native value={currentAudioDeviceId} onChange={handleAudioDeviceChange}>
              {audioDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </Select>
          </FormControl>
        </Grid>
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
        {getMediaControl()}
        {getPermissionDenied()}
        {getPermissionNotYetAllowed()}
      </Grid>
    </Grid>
  )
}
export default SetupMicAndCamera
