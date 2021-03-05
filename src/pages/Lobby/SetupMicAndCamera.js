import React, { useCallback, useEffect, useState } from 'react'
import Video from 'twilio-video'
import { Button, FormControl, Grid, InputLabel, Select, Typography } from '@material-ui/core'
import { useLobbyStyles } from '.'
import { GUMErrorModal } from '../../common'
import { useUserEventStatusContext } from '../../context'

const SetupMicAndCamera = ({ usersName }) => {
  const classes = useLobbyStyles()
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
  const [gumErrorName, setGumErrorName] = useState('')

  const getDevices = useCallback(async () => {
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
  }, [audioStreamLabel, videoStreamLabel])

  const stopUsersCurrentTracks = async () => {
    usersLocalMediaStream.getTracks().forEach((track) => track.stop())
    setUsersLocalMediaStream(null)
  }

  const getMedia = async () => {
    if (usersLocalMediaStream?.active) {
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
      setPermissionDenied(true)
      setPermissionNotYetAllowed(false)
      setGumErrorName(error.name)
    }
  }

  useEffect(() => {
    getDevices()
  }, [getDevices])

  useEffect(() => {
    getMedia()
  }, []) //eslint-disable-line

  const getPermissionDenied = () => {
    if (permissionDenied) {
      return (
        <div className={classes.cameraBlocked}>
          <Grid container justify="center" direction="column" className={classes.blockedText}>
            <Typography variant="h3">Your camera or mic is blocked</Typography>
            <Typography variant="h3">
              To unblock - click the &quot;camera blocked&quot; icon in the address bar
            </Typography>
            <Typography variant="h3">Allow access, then refresh the page</Typography>
          </Grid>
        </div>
      )
    }
  }

  const getDamnYouLookGood = () => {
    const usersFirstName = usersName?.split(' ')[0]
    return (
      !permissionNotYetAllowed &&
      !permissionDenied && (
        <Grid
          container
          direction="row"
          justify="flex-start"
          className={classes.youLookGoodContainer}
        >
          {usersName ? (
            <>
              <Typography variant="h2" style={{ marginBottom: '12px' }}>
                Damn, {usersFirstName && usersFirstName[0].toUpperCase() + usersFirstName.slice(1)}.
                You look good{''}
                <span
                  style={{ margin: '0px 10px', fontSize: 30 }}
                  role="img"
                  aria-label="woozy face emoji"
                >
                  🤩
                </span>
              </Typography>
              <Typography variant="h4">You&apos;re all set to join the event!</Typography>
            </>
          ) : (
            <Typography variant="h3" className={classes.setupMicAndCameraModalText}>
              Select the video/audio source you would like to use
            </Typography>
          )}
        </Grid>
      )
    )
  }

  const handleAudioDeviceChange = (event) => {
    localStorage.setItem('preferredAudioId', event.target.value)
    setCurrentAudioDeviceId(event.target.value)
    getMedia()
    if (window.room) {
      const { localParticipant } = window.room
      const tracks = Array.from(localParticipant.audioTracks.values()).map(function (
        trackPublication
      ) {
        return trackPublication.track
      })
      console.log('handleVideoDeviceChange -> tracks', tracks)
      localParticipant.unpublishTracks(tracks)

      Video.createLocalAudioTrack({
        deviceId: { exact: event.target.value },
      }).then(function (localAudioTrack) {
        localParticipant.publishTrack(localAudioTrack)
      })
    }
  }

  const handleVideoDeviceChange = (event) => {
    localStorage.setItem('preferredVideoId', event.target.value)
    setCurrentVideoDeviceId(event.target.value)
    getMedia()
    if (window.room) {
      const { localParticipant } = window.room
      const tracks = Array.from(localParticipant.videoTracks.values()).map(function (
        trackPublication
      ) {
        return trackPublication.track
      })
      localParticipant.unpublishTracks(tracks)

      Video.createLocalVideoTrack({
        deviceId: { exact: event.target.value },
      }).then(function (localVideoTrack) {
        const localDiv = document.getElementById('local-video')
        localDiv.innerHTML = ''
        const attachedTrack = localVideoTrack.attach()
        attachedTrack.style.transform = 'scale(-1, 1)'
        localDiv.appendChild(attachedTrack)
        localParticipant.publishTrack(localVideoTrack)
      })
    }
  }

  const handleJoinEventClick = () => {
    setUserHasEnabledCameraAndMic(true)
  }

  const getDeviceDropdownMenu = () => {
    return (
      !permissionNotYetAllowed &&
      !permissionDenied && (
        <Grid container direction="column" justify="space-between" alignItems="center">
          <FormControl fullWidth className={classes.selectInputBox}>
            <InputLabel>Camera</InputLabel>
            <Select native value={currentVideoDeviceId} onChange={handleVideoDeviceChange}>
              {videoDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth className={classes.selectInputBox}>
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
          {usersName && (
            <Button
              variant="contained"
              color="primary"
              className={classes.joinEventButton}
              onClick={handleJoinEventClick}
              disableRipple
            >
              Join the event
            </Button>
          )}
        </Grid>
      ) : (
        <>
          <Typography variant="h3" className={classes.setupMicAndCameraModalText}>
            Please select your preferred camera and mic and press &apos;allow&apos;
          </Typography>
        </>
      )}
      {gumErrorName ? (
        <GUMErrorModal errorName={gumErrorName} onComplete={() => setGumErrorName('')} />
      ) : null}
    </Grid>
  )
}
export default SetupMicAndCamera
