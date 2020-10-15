import React, { useEffect, useState } from 'react'

import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { useUserEventStatusContext } from '../../context'
import cameraBlocked from '../../assets/cameraBlocked.png'

const useStyles = makeStyles((theme) => ({
  blockedText: {
    position: 'fixed',
    bottom: '40%',
    width: '100%',
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
  joinEventButton: {
    marginTop: theme.spacing(4),
    width: '100%',
  },
  permissionsContainer: {
    width: '90%',
    margin: 'auto',
  },
  permissionsContent: {
    width: '90%',
    margin: 'auto',
  },
  selectBox: {
    margin: theme.spacing(0.5, 0),
  },
  youLookGoodContainer: {
    marginBottom: theme.spacing(4),
  },
}))

const SetupMicAndCamera = ({ usersName }) => {
  const classes = useStyles()
  const { setUserHasEnabledCameraAndMic } = useUserEventStatusContext()
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [permissionNotYetAllowed, setPermissionNotYetAllowed] = useState(true)
  const [videoDevices, setVideoDevices] = useState([])
  const [audioDevices, setAudioDevices] = useState([])
  const [currentVideoDeviceId, setCurrentVideoDeviceId] = useState('')
  const [currentAudioDeviceId, setCurrentAudioDeviceId] = useState('')
  const [audioStreamLabel, setAudioStreamLabel] = useState('')
  const [videoStreamLabel, setVideoStreamLabel] = useState('')
  const [usersLocalMediaStream, setUsersLocalMediaStream] = useState(null)

  const getDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const availableVideoDevices = devices.filter((device) => device.kind === 'videoinput')
    const availableAudioDevices = devices.filter((device) => device.kind === 'audioinput')
    setVideoDevices(availableVideoDevices)
    setAudioDevices(availableAudioDevices)
    const localStoragePreferredVideoId = localStorage.getItem('preferredVideoId')
    const localStoragePreferredAudioId = localStorage.getItem('preferredAudioId')
    const videoDeviceSelectedFromGetUserMedia =
      videoStreamLabel &&
      availableVideoDevices.find((device) => device.label === videoStreamLabel).deviceId
    const audioDeviceSelectedFromGetUserMedia =
      audioStreamLabel &&
      availableAudioDevices.find((device) => device.label === audioStreamLabel).deviceId

    if (availableVideoDevices.length) {
      if (
        !localStoragePreferredVideoId ||
        !availableVideoDevices.find((device) => device.deviceId === localStoragePreferredVideoId) ||
        videoDeviceSelectedFromGetUserMedia !== localStoragePreferredVideoId
      ) {
        localStorage.setItem('preferredVideoId', videoDeviceSelectedFromGetUserMedia)
        setCurrentVideoDeviceId(videoDeviceSelectedFromGetUserMedia)
      } else {
        setCurrentVideoDeviceId(localStoragePreferredVideoId)
      }
    }

    if (availableAudioDevices.length) {
      if (
        !localStoragePreferredAudioId ||
        !availableAudioDevices.find((device) => device.deviceId === localStoragePreferredAudioId) ||
        audioDeviceSelectedFromGetUserMedia !== localStoragePreferredAudioId
      ) {
        localStorage.setItem('preferredAudioId', availableAudioDevices[0].deviceId)
        setCurrentAudioDeviceId(audioDeviceSelectedFromGetUserMedia)
      } else {
        setCurrentAudioDeviceId(localStoragePreferredAudioId)
      }
    }
  }

  const stopUsersCurrentTracks = async () => {
    usersLocalMediaStream.getTracks().forEach((track) => track.stop())
    console.log('successfully stopped users tracks')
    setUsersLocalMediaStream(null)
  }

  const getMedia = async () => {
    if (usersLocalMediaStream && usersLocalMediaStream.active) {
      await stopUsersCurrentTracks()
    }
    let localMediaStream = null
    let constraints
    const localStoragePreferredVideoId = localStorage.getItem('preferredVideoId')
    const localStoragePreferredAudioId = localStorage.getItem('preferredAudioId')
    if (localStoragePreferredAudioId || localStoragePreferredVideoId) {
      constraints = {
        video: { deviceId: localStoragePreferredVideoId },
        audio: { deviceId: localStoragePreferredAudioId },
      }
    }
    try {
      localMediaStream = await navigator.mediaDevices.getUserMedia(
        constraints || { audio: true, video: true }
      )
      setUsersLocalMediaStream(localMediaStream)
      const videoTrackLabel = localMediaStream.getVideoTracks()[0].label
      const audioTrackLabel = localMediaStream.getAudioTracks()[0].label
      setVideoStreamLabel(videoTrackLabel)
      setAudioStreamLabel(audioTrackLabel)
      const video = document.getElementById('videoElement')
      setPermissionDenied(false)
      setPermissionNotYetAllowed(false)
      video.srcObject = localMediaStream
    } catch (error) {
      console.warn('error - ', error)
      alert(error.message)
      setPermissionDenied(true)
      setPermissionNotYetAllowed(false)
    }
  }

  navigator.mediaDevices.ondevicechange = () => {
    console.log('on device change')
    getDevices()
  }

  useEffect(() => {
    if (videoStreamLabel || audioStreamLabel) {
      getDevices()
    }
  }, [videoStreamLabel, audioStreamLabel])

  useEffect(() => {
    getMedia()
  }, [])

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

  const getDamnYouLookGood = () => {
    const usersFirstName = usersName && usersName.split(' ')[0]
    return (
      !permissionNotYetAllowed &&
      !permissionDenied && (
        <Grid
          container
          direction="row"
          justify="flex-start"
          className={classes.youLookGoodContainer}
        >
          <Typography variant="h4" style={{ marginBottom: '12px' }}>
            Damn. You look good{' '}
            {usersFirstName && usersFirstName[0].toUpperCase() + usersFirstName.slice(1)}
            {''}
            <span
              style={{ margin: '0px 10px', fontSize: 30 }}
              role="img"
              aria-label="woozy face emoji"
            >
              🤩
            </span>
          </Typography>
          <Typography variant="h5">You&apos;re all set to join the event!</Typography>
        </Grid>
      )
    )
  }

  const handleAudioDeviceChange = (event) => {
    localStorage.setItem('preferredAudioId', event.target.value)
    setCurrentAudioDeviceId(event.target.value)
    console.log('audio device change, update the local video')
    getMedia()
  }

  const handleVideoDeviceChange = (event) => {
    localStorage.setItem('preferredVideoId', event.target.value)
    setCurrentVideoDeviceId(event.target.value)
    console.log('video device change, update the local video')
    getMedia()
  }

  const handleJoinEventClick = () => {
    setUserHasEnabledCameraAndMic(true)
  }

  const getDeviceDropdownMenu = () => {
    return (
      !permissionNotYetAllowed &&
      !permissionDenied && (
        <Grid container direction="column" justify="space-between" alignItems="center">
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
      justify="center"
      alignItems="center"
    >
      {videoStreamLabel && audioStreamLabel ? (
        <Grid container className={classes.permissionsContent} justify="center" alignItems="center">
          {getDamnYouLookGood()}
          {getDeviceDropdownMenu()}
          {getPermissionDenied()}
          <Button
            variant="contained"
            color="primary"
            className={classes.joinEventButton}
            onClick={handleJoinEventClick}
          >
            Join the event
          </Button>
        </Grid>
      ) : (
        <>
          <Typography variant="h5" style={{ textAlign: 'center' }}>
            Please select your preferred camera and mic and press &apos;allow&apos;
          </Typography>
        </>
      )}
    </Grid>
  )
}
export default SetupMicAndCamera
