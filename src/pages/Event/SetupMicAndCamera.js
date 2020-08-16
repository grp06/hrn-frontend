import React, { useEffect, useState } from 'react'

import { Grid, Typography, FormControl, InputLabel, Select } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useAppContext } from '../../context/useAppContext'
import cameraBlocked from '../../assets/cameraBlocked.png'

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
  const [videoDevices, setVideoDevices] = useState([])
  const [audioDevices, setAudioDevices] = useState([])
  const [speakerDevices, setSpeakerDevices] = useState([])
  const [currentVideoDeviceId, setCurrentVideoDeviceId] = useState('')
  const [currentAudioDeviceId, setCurrentAudioDeviceId] = useState('')
  const [currentSpeakerDeviceId, setCurrentSpeakerDeviceId] = useState('')

  const getDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    console.log(devices)
    const availableVideoDevices = devices.filter((device) => device.kind === 'videoinput')
    const availableAudioDevices = devices.filter((device) => device.kind === 'audioinput')
    const availableSpeakerDevices = devices.filter((device) => device.kind === 'audiooutput')
    setVideoDevices(availableVideoDevices)
    setAudioDevices(availableAudioDevices)
    setSpeakerDevices(availableSpeakerDevices)

    const localStoragePreferredVideoId = localStorage.getItem('preferredVideoId')
    const localStoragePreferredAudioId = localStorage.getItem('preferredAudioId')
    const localStoragePreferredSpeakerId = localStorage.getItem('preferredSpeakerId')

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

    if (availableSpeakerDevices.length) {
      if (
        !localStoragePreferredSpeakerId ||
        !availableSpeakerDevices.find(
          (device) => device.deviceId === localStoragePreferredSpeakerId
        )
      ) {
        localStorage.setItem('preferredSpeakerId', availableSpeakerDevices[0].deviceId)
        setCurrentSpeakerDeviceId(availableSpeakerDevices[0].deviceId)
      } else {
        setCurrentSpeakerDeviceId(localStoragePreferredSpeakerId)
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
    getMedia({
      video: { deviceId: currentVideoDeviceId },
      audio: { deviceId: currentAudioDeviceId },
    })
  }, [currentVideoDeviceId, currentAudioDeviceId])

  useEffect(() => {
    const changeSpeakerDevice = async () => {
      const video = document.querySelector('#videoElement')
      await video.setSinkId(currentSpeakerDeviceId)
    }
    if (!permissionNotYetAllowed && !permissionDenied) {
      changeSpeakerDevice()
    }
  }, [currentSpeakerDeviceId])

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
        <Typography variant="h4" className={classes.animatedItem}>
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

  const handleSpeakerDeviceChange = (event) => {
    localStorage.setItem('preferredSpeakerId', event.target.value)
    setCurrentSpeakerDeviceId(event.target.value)
  }

  const getMediaControl = () => {
    return (
      !permissionNotYetAllowed &&
      !permissionDenied && (
        <Grid container direction="column" justify="space-around" alignItems="center">
          <FormControl>
            <InputLabel>Camera</InputLabel>
            <Select native value={currentVideoDeviceId} onChange={handleVideoDeviceChange}>
              {videoDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Microphone</InputLabel>
            <Select native value={currentAudioDeviceId} onChange={handleAudioDeviceChange}>
              {audioDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Speakers</InputLabel>
            <Select native value={currentSpeakerDeviceId} onChange={handleSpeakerDeviceChange}>
              {speakerDevices.map((device) => (
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
