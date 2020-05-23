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
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: true,
        })
        .then(function (mediaStream) {
          return connect(token, {
            name: roomId,
            tracks: mediaStream.getTracks(),
          })
        })
        .then(function (room) {
          // Add video after connecting to the Room
          createLocalVideoTrack().then(function (localTrack) {
            room.localParticipant.publishTrack(localTrack)
          })

          // For RemoteParticipants that are already in the Room, we can attach their RemoteTracks
          // by iterating over the Room's participants:
          room.participants.forEach((remoteParticipant) => {
            remoteParticipant.tracks.forEach((track) => {
              console.log('attaching track = ', track)
              if (track.track) {
                const attachedTrack = track.track.attach()
                attachedTrack.muted = true

                console.log('attachedTrack = ', attachedTrack)
                document.getElementById('remote-media-div').appendChild(attachedTrack)
              }
            })

            remoteParticipant.on('trackSubscribed', (track) => {
              const remoteDiv = document.getElementById('remote-media-div')
              if (remoteDiv) {
                const attachedTrack = track.attach()
                attachedTrack.muted = true

                console.log('attachedTrack = ', attachedTrack)
                remoteDiv.appendChild(attachedTrack)
              }
            })
          })

          // When Participants connect to or disconnect from a Room that you're connected to,
          // you'll be notified via Participant connection events:
          room.on('participantConnected', function (remoteParticipant) {
            console.log(`Participant "${remoteParticipant.identity}" connected`)

            remoteParticipant.tracks.forEach((track) => {
              if (track.isSubscribed) {
                const remoteDiv = document.getElementById('remote-media-div')
                if (remoteDiv) {
                  const attachedTrack = track.track.attach()
                  attachedTrack.muted = true

                  console.log('attachedTrack = ', attachedTrack)
                  remoteDiv.appendChild(attachedTrack)
                }
              }
            })

            remoteParticipant.on('trackSubscribed', (track) => {
              console.log('on participantConnected trackSubscribed ')
              const remoteDiv = document.getElementById('remote-media-div')
              if (remoteDiv) {
                const attachedTrack = track.attach()
                attachedTrack.muted = true

                console.log('attachedTrack = ', attachedTrack)
                remoteDiv.appendChild(attachedTrack)
              }
            })
          })
          // when the remote participant disconnects, remove their stuff?
          room.on('participantDisconnected', (remoteParticipant) => {
            const remoteDiv = document.getElementById('remote-media-div')
            if (remoteDiv) {
              remoteDiv.innerHTML = ''
            }
          })
          // when you disconnect, stop our track and detach them
          room.on('disconnected', function (rum, error) {
            if (error) {
              console.log('Unexpectedly disconnected:', error)
            }
            rum.localParticipant.tracks.forEach(function (track) {
              track.unpublish()
            })
            const remoteDiv = document.getElementById('remote-media-div')
            if (remoteDiv) {
              remoteDiv.innerHTML = ''
            }
          })
        })
    }
  }, [roomId, token])

  const remoteParticipants = participants.map((participant) => {
    console.log('mapping over remote participants = ', participant)
    return <Participant key={participant.sid} participant={participant} />
  })
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
