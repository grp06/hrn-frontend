import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useGameContext } from '../context/useGameContext'
import { participantConnected } from '../helpers'
import { useSetToken, useSetRoomId, useRoom } from '../hooks'

const width = window.innerWidth
const height = window.innerHeight
const useStyles = makeStyles((theme) => ({
  videoWrapper: {
    position: 'fixed',
    marginTop: 200,
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
    height: '200px',
    position: 'absolute',
    top: '15px',
    right: '15px',
    '& video': {
      borderRadius: 15,
    },
  },
}))

const UserControl = () => {
  const classes = useStyles()
  const [eventStarted, setEventStarted] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)
  const { room } = useRoom()

  const joinRoom = () => {
    console.log('joining room ')
    const { localParticipant } = room
    localParticipant.tracks.forEach((publication) => {})

    room.participants.forEach(participantConnected)
    room.on('participantConnected', participantConnected)

    room.on('participantDisconnected', (remoteParticipant) => {
      const remoteDiv = document.getElementById('remote-media-div')
      if (remoteDiv) {
        remoteDiv.innerHTML = ''
      }
    })

    window.addEventListener('beforeunload', () => {
      room.disconnect()
    })

    room.on('disconnected', function (rum, error) {
      rum.localParticipant.tracks.forEach(function (track) {
        track.unpublish()
      })

      const remoteDiv = document.getElementById('remote-media-div')
      if (remoteDiv) {
        remoteDiv.innerHTML = ''
      }
    })
  }

  if (!room) {
    return <div>waiting for round to start</div>
  }

  return (
    <div>
      <button onClick={joinRoom}>Join Room</button>
      <div className={classes.videoWrapper}>
        <div id="my-video" className={classes.myVideo} />
        <div id="remote-media-div" className={classes.mainVid} />
      </div>
    </div>
  )
}
export default UserControl
