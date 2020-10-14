import React, { useEffect, useState } from 'react'

import { Grid, Typography, FormControl, InputLabel, Select } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import Video from 'twilio-video'
import { useEventContext, useUserEventStatusContext } from '../../context'
import cameraBlocked from '../../assets/cameraBlocked.png'

const useStyles = makeStyles((theme) => ({
  permissionsContainer: {
    width: '90%',
    margin: 'auto',
  },
  permissionsContent: {
    width: '90%',
    margin: 'auto',
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
  selectBox: {
    margin: theme.spacing(0.5, 0),
  },
}))

function detachTracks(tracks) {
  tracks.forEach(function (track) {
    if (track) {
      track.detach().forEach(function (detachedElement) {
        detachedElement.remove()
      })
    }
  })
}

const NewSetupCameraAndMic = () => {
  const classes = useStyles()
  const { setCameraAndMicPermissions } = useEventContext()
  const {
    usersListOfAudioDevices,
    usersListOfVideoDevices,
    usersPreferredAudioDevice,
    usersPreferredVideoDevice,
    setUsersListOfAudioDevices,
    setUsersListOfVideoDevices,
    setUsersPreferredAudioDevice,
    setUsersPreferredVideoDevice,
  } = useUserEventStatusContext()
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [permissionNotYetAllowed, setPermissionNotYetAllowed] = useState(true)

  const getDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const availableVideoDevices = devices.filter((device) => device.kind === 'videoinput')
    const availableAudioDevices = devices.filter((device) => device.kind === 'audioinput')
    setUsersListOfVideoDevices(availableVideoDevices)
    setUsersListOfAudioDevices(availableAudioDevices)

    const localStoragePreferredVideoId = localStorage.getItem('preferredVideoId')
    const localStoragePreferredAudioId = localStorage.getItem('preferredAudioId')

    if (availableVideoDevices.length) {
      if (
        !localStoragePreferredVideoId ||
        !availableVideoDevices.find((device) => device.deviceId === localStoragePreferredVideoId)
      ) {
        console.log('getting into here')
        setUsersPreferredVideoDevice(availableVideoDevices[0].deviceId)
      } else {
        setUsersPreferredVideoDevice(localStoragePreferredVideoId)
      }
    }

    if (availableAudioDevices.length) {
      if (
        !localStoragePreferredAudioId ||
        !availableAudioDevices.find((device) => device.deviceId === localStoragePreferredAudioId)
      ) {
        setUsersPreferredAudioDevice(availableAudioDevices[0].deviceId)
      } else {
        setUsersPreferredAudioDevice(localStoragePreferredAudioId)
      }
    }
  }

  navigator.mediaDevices.ondevicechange = () => {
    console.log('on device change')
    getDevices()
  }

  // useEffect(() => {
  //   console.log('getting the devices')
  //   getDevices()
  // }, [])

  useEffect(() => {
    const getMedia = async (constraints) => {
      let localMediaStream = null

      try {
        console.log('constraints ->', constraints)
        localMediaStream = await navigator.mediaDevices.getUserMedia(constraints)
        getDevices()
        console.log('getMedia -> localMediaStream', localMediaStream)
        const video = document.getElementById('videoElement')
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
          // Do something with the video here.
        }
      } catch (error) {
        console.warn('error - ', error)
        alert(error.message)
        setPermissionDenied(true)
        setPermissionNotYetAllowed(false)
        // if (err === 'PERMISSION_DENIED') {
        //   // Explain why you need permission and how to update the permission setting
        // }
      }
    }

    // if (usersPreferredVideoDevice && usersPreferredAudioDevice) {
    console.log('usersPreferredVideoDevice ->', usersPreferredVideoDevice)
    console.log('usersPreferredAudioDevice ->', usersPreferredAudioDevice)
    getMedia({
      video: { deviceId: usersPreferredVideoDevice },
      audio: { deviceId: usersPreferredAudioDevice },
    })
  }, [usersPreferredVideoDevice, usersPreferredAudioDevice])

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
    console.log('event.target.value ->', event.target.value)
    localStorage.setItem('preferredVideoId', event.target.value)
    setUsersPreferredVideoDevice(event.target.value)
    console.log('device change, update the local video')
  }

  const handleAudioDeviceChange = (event) => {
    console.log('event.target.value -> ', event.target.value)
    localStorage.setItem('preferredAudioId', event.target.value)
    setUsersPreferredAudioDevice(event.target.value)
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
            <Select native value={usersPreferredVideoDevice} onChange={handleVideoDeviceChange}>
              {usersListOfVideoDevices
                .sort((device) =>
                  device.deviceId === localStorage.getItem('preferredVideoId') ? -1 : 1
                )
                .map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth className={classes.selectBox}>
            <InputLabel>Microphone</InputLabel>
            <Select native value={usersPreferredAudioDevice} onChange={handleAudioDeviceChange}>
              {usersListOfAudioDevices
                .sort((device) => (device.deviceId === usersPreferredAudioDevice ? -1 : 1))
                .map((device) => (
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
      justify="center"
      alignItems="center"
    >
      <Grid container className={classes.permissionsContent} justify="center" alignItems="center">
        {getDamnYouLookGood()}
        {getMediaControl()}
        {getPermissionDenied()}
        {getPermissionNotYetAllowed()}
      </Grid>
    </Grid>
  )
}
export default NewSetupCameraAndMic
