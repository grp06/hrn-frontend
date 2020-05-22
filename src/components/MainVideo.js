import React, { useEffect, useContext, useState } from 'react'
import { styled } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import { useGameContext } from '../context/useGameContext'
import Participant from './Participant'

const {
  connect,
  createLocalTracks,
  createLocalVideoTrack,
  createLocalAudioTrack,
} = require('twilio-video')

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
    height: '200px',
    position: 'absolute',
    top: '15px',
    right: '15px',
    '& video': {
      borderRadius: 15,
    },
  },
}))

const MainVideo = () => {
  const [room, setRoom] = useState(null)
  const [participants, setParticipants] = useState([])
  const { token, roomId } = useGameContext()

  useEffect(() => {
    if (token) {
      const participantConnected = (participant) => {
        setParticipants((prevParticipants) => [...prevParticipants, participant])
      }

      const participantDisconnected = (participant) => {
        setParticipants((prevParticipants) => prevParticipants.filter((p) => p !== participant))
      }
      console.log('token = ')
      connect(token, {
        name: roomId,
      }).then((room) => {
        setRoom(room)
        room.on('participantConnected', participantConnected)
        room.on('participantDisconnected', participantDisconnected)
        room.participants.forEach(participantConnected)
      })

      return () => {
        setRoom((currentRoom) => {
          if (currentRoom && currentRoom.localParticipant.state === 'connected') {
            currentRoom.localParticipant.tracks.forEach(function (trackPublication) {
              trackPublication.track.stop()
            })
            currentRoom.disconnect()
            return null
          }
          return currentRoom
        })
      }
    }
  }, [roomId, token])

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ))
  console.log('roomId = ', roomId)
  return (
    <div className="room">
      <h2>
        Room:
        {roomId}
      </h2>
      <div className="local-participant">
        {room ? (
          <Participant key={room.localParticipant.sid} participant={room.localParticipant} />
        ) : (
          ''
        )}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  )
}

export default MainVideo
