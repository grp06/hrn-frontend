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
  const { token, partnerX, roundsData } = useGameContext()
  if (!roundsData) {
    return <div>nothing</div>
  }
  if (!token || !partnerX) {
    return <div>no token yet :(</div>
  }

  // Connect to the Room with just video
  connect(token, {
    name: partnerX,
    audio: false,
  }).then(function (room) {
    console.log('room = ', room)

    // Add video after connecting to the Room
    createLocalVideoTrack().then(function (localTrack) {
      console.log('localTrack', localTrack)
      room.localParticipant.publishTrack(localTrack)
    })

    // find participants already in room
    room.participants.forEach((participant) => {
      console.log('participant = ', participant)

      // participant.tracks.forEach((publication) => {
      //   if (publication.isSubscribed) {
      //     const { track } = publication
      //     console.log('participants', track)
      //     document.getElementById('remote-media-div').appendChild(track.attach())
      //   }
      // })

      // check to see if they have any published tracks and append to remote media div
      participant.tracks.forEach((publication) => {
        if (publication.track) {
          console.log('track publication', publication.track)
          document.getElementById('remote-media-div').appendChild(publication.track)
        }
      })

      // RemoteTrack was published by the RemoteParticipant after connecting to the Room.
      // This event is not emitted for RemoteTracks that were published while the RemoteParticipant
      // was connecting to the Room.
      participant.on('trackPublished', (track) => {
        document.getElementById('remote-media-div').appendChild(track)
        console.log('trackpublished', track)
      })

      // A remoteParticipant's RemoteTrack was subscribed to
      participant.on('trackSubscribed', (track) => {
        console.log('trackSubscribed', track)
        document.getElementById('remote-media-div').appendChild(track.attach())
      })
      // we should have it when the participant unappends
      participant.on('trackUnpublished', (track) => {
        console.log('remote user has unpublished this track:', track)
      })
    })

    // listening for a remote participant to join
    room.on('participantConnected', function (participant) {
      console.log(`${participant.identity} joined the Room`)
    })

    // when the remote participant disconnects, remove their stuff?
    room.on('participantDisconnected', (participant) => {
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
    })
  })

  return (
    <div className={classes.videoWrapper}>
      <div id="my-video" className={classes.myVideo} />
      <div id="remote-media-div" className={classes.mainVid} />
    </div>
  )
}
export default MainVideo
