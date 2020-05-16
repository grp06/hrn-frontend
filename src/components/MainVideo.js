import React, { useEffect, useContext, useState } from 'react'

import { styled } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'

import { useGameContext } from '../context/useGameContext'

const { connect, createLocalTracks, createLocalVideoTrack } = require('twilio-video')

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

  const { myToken, partnerX, userId, getToken, allRounds } = useGameContext()

  if (!allRounds) {
    return <div>nothing</div>
  }

  // if (!myToken || !partnerX) {
  //   return <div>no token yet :(</div>
  // }

  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 576, ideal: 720, max: 1080 },
      },
    })
    .then(function (mediaStream) {
      return connect(myToken, {
        name: partnerX,
        tracks: mediaStream.getTracks(),
      })
    })
    .then((room) => {
      window.addEventListener('beforeunload', () => room.disconnect())

      room.on('disconnected', (rum) => {
        // Detach the local media elements
        console.log('on disconnected')
        rum.localParticipant.tracks.forEach((publication) => {
          console.log('do we remove shit?')
          const attachedElements = publication.track.detach()
          attachedElements.forEach((element) => element.remove())
        })
        document.getElementById('remote-media-div').innerHTML = ''
      })
      // Log your Client's LocalParticipant in the Room
      const { localParticipant } = room
      console.log('Connected to the Room my participant = ', localParticipant)

      // Log any Participants already connected to the Room
      room.participants.forEach((participant) => {
        console.log(`ID "${participant.identity}" is already here`)
      })

      // Log Participants as they disconnect from the Room
      room.once('participantDisconnected', (participant) => {
        console.log('your partner disconnected = ', participant)
        participant.tracks.forEach((publication) => {
          if (publication.track) {
            document.getElementById('remote-media-div').innerHTML = ''
          }
        })
      })

      // Log new Participants as they connect to the Room
      room.on('participantConnected', (participant) => {
        console.log(`onConnected --- ID "${participant.identity}" just connected`)
        const videoDiv = document.getElementById('remote-media-div')
        if (videoDiv && videoDiv.children.length) {
          videoDiv.innerHTML = ''
        }
        participant.tracks.forEach((publication) => {
          if (publication.isSubscribed) {
            const { track } = publication
            document.getElementById('remote-media-div').appendChild(track.attach())
          }
        })

        participant.on('trackSubscribed', (track) => {
          document.getElementById('remote-media-div').appendChild(track.attach())
        })
      })

      room.participants.forEach((participant) => {
        participant.tracks.forEach((publication) => {
          if (publication.track) {
            console.log('pulication.track = ', publication.track)
            document.getElementById('remote-media-div').appendChild(publication.track.attach())
          }
        })

        participant.on('trackSubscribed', (track) => {
          document.getElementById('remote-media-div').appendChild(track.attach())
        })
      })
      createLocalVideoTrack({ height: 200, frameRate: 24, width: 200 }).then(function (track) {
        const videoElement = track.attach()
        document.getElementById('my-video').appendChild(videoElement)
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
