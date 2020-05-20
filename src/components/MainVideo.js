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

  const { token, partnerX, roundsData, room, setRoom } = useGameContext()

  if (!roundsData) {
    return <div>nothing</div>
  }
  if (!token || !partnerX) {
    return <div>no token yet :(</div>
  }
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      // video: {
      //   width: { min: 1024, ideal: 1280, max: 1920 },
      //   height: { min: 576, ideal: 720, max: 1080 },
      // },
      width: { max: 192 },
      height: { max: 108 },
      video: true,
    })
    .then(function (mediaStream) {
      return connect(token, {
        name: partnerX,
        tracks: mediaStream.getTracks(),
      })
    })
    .then((twilioRoom) => {
      window.addEventListener('beforeunload', () => twilioRoom.disconnect())

      console.log('twilioRoom === ', twilioRoom)

      twilioRoom.on('disconnected', (rum) => {
        // Detach the local media elements
        console.log('on disconnected')
        rum.localParticipant.tracks.forEach((publication) => {
          console.log('publication ', publication)
          const attachedElements = publication.track.detach()
          attachedElements.forEach((element) => element.remove())
        })
        const remote = document.getElementById('remote-media-div')
        if (remote) {
          remote.innerHTML = ''
        }
      })
      // Log your Client's LocalParticipant in the Room
      const { localParticipant } = twilioRoom
      console.log('Connected to the Room my participant = ', localParticipant)

      // Log any Participants already connected to the Room
      twilioRoom.participants.forEach((participant) => {
        console.log(`ID "${participant.identity}" is already here`)
      })

      // Log Participants as they disconnect from the Room
      twilioRoom.once('participantDisconnected', (participant) => {
        console.log('your partner disconnected = ', participant)
        participant.tracks.forEach((publication) => {
          if (publication.track) {
            document.getElementById('remote-media-div').innerHTML = ''
          }
        })
      })

      // Log new Participants as they connect to the Room
      twilioRoom.on('participantConnected', (participant) => {
        console.log(
          `participantConnected with --- ID "${participant.identity}" just connected ${participant}`
        )
        // const videoDiv = document.getElementById('remote-media-div')
        // if (videoDiv && videoDiv.children.length) {
        //   videoDiv.innerHTML = ''
        // }
        participant.tracks.forEach((publication) => {
          if (publication.isSubscribed) {
            const { track } = publication
            document.getElementById('remote-media-div').appendChild(track.attach())
          }
        })

        participant.on('trackSubscribed', (track) => {
          const remoteMediaDiv = document.getElementById('remote-media-div')
          remoteMediaDiv && remoteMediaDiv.appendChild(track.attach())
        })
      })

      twilioRoom.participants.forEach((participant) => {
        console.log('twilioRoom.participants.forEach ')
        participant.tracks.forEach((publication) => {
          if (publication.track) {
            console.log('pulication.track = ', publication.track)
            document.getElementById('remote-media-div').appendChild(publication.track.attach())
          }
        })

        participant.on('trackSubscribed', (track) => {
          document.getElementById('remote-media-div') &&
            document.getElementById('remote-media-div').appendChild(track.attach())
        })
      })
      // createLocalVideoTrack({ height: 200, frameRate: 24, width: 200 }).then(function (track) {
      //   const videoElement = track.attach()
      //   document.getElementById('my-video').appendChild(videoElement)
      // })
    })

  return (
    <div className={classes.videoWrapper}>
      <div id="my-video" className={classes.myVideo} />
      <div id="remote-media-div" className={classes.mainVid} />
    </div>
  )
}

export default MainVideo
