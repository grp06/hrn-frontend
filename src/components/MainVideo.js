import React, { useEffect, useContext, useState } from 'react'
import { styled } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import { useGameContext } from '../context/useGameContext'

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
  const classes = useStyles()
  const { token, roomId, roundsData } = useGameContext()

  // Connect to the Room with just video
  console.log('render')
  useEffect(() => {
    if (token) {
      connect(token, {
        name: roomId,
        audio: false,
      }).then(function (room) {
        // Add video after connecting to the Room
        createLocalVideoTrack().then(function (localTrack) {
          room.localParticipant.publishTrack(localTrack)
        })
        // find participants already in room
        // room.participants.forEach((remoteParticipant) => {
        //   console.log('remoteParticipant = ', remoteParticipant)

        //   // check to see if they have any published tracks and append to remote media div
        //   remoteParticipant.tracks.forEach((tracks) => {
        //     if (tracks.track) {
        //       console.log('track publication', tracks.track)
        //       document.getElementById('remote-media-div').appendChild(tracks.track.attach())
        //     }
        //   })
        //   remoteParticipant.on('trackSubscribed', (track) => {
        //     console.log('trackSubscribed', track)
        //     if (track.kind === 'video') {
        //       const videoElement = track.attach()
        //       document.getElementById('remote-media-div').appendChild(videoElement)
        //     }
        //   })
        // })

        // For RemoteParticipants that are already in the Room, we can attach their RemoteTracks
        // by iterating over the Room's participants:
        room.participants.forEach((remoteParticipant) => {
          remoteParticipant.tracks.forEach((track) => {
            if (track.track) {
              document.getElementById('remote-media-div').appendChild(track.track.attach())
            }
          })

          remoteParticipant.on('trackSubscribed', (track) => {
            const remoteDiv = document.getElementById('remote-media-div')
            if (remoteDiv) {
              remoteDiv.appendChild(track.attach())
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
                remoteDiv.appendChild(track.track.attach())
              }
            }
          })

          remoteParticipant.on('trackSubscribed', (track) => {
            const remoteDiv = document.getElementById('remote-media-div')
            if (remoteDiv) {
              remoteDiv.appendChild(track.attach())
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
  }, [token])

  if (!roundsData) {
    return <div>nothing</div>
  }
  if (!token || !roomId) {
    return <div>no token yet :(</div>
  }

  return (
    <div className={classes.videoWrapper}>
      <div id="my-video" className={classes.myVideo} />
      <div id="remote-media-div" className={classes.mainVid} />
    </div>
  )
}
export default MainVideo
