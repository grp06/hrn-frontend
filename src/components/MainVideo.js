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

  const { token, partnerX, roundsData } = useGameContext()

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
    .then((room) => {
      console.log(`Connected to Room: ${room.name}`)

      // Log your Client's LocalParticipant in the Room
      const { localParticipant } = room
      console.log(`Connected to the Room as LocalParticipant "${localParticipant.identity}"`)

      // Log any Participants already connected to the Room
      room.participants.forEach((participant) => {
        console.log(`Participant "${participant.identity}" is connected to the Room`)

        // not in the code we copied from twilio
        participant.tracks.forEach((publication) => {
          if (publication.isSubscribed) {
            const { track } = publication
            document.getElementById('remote-media-div').appendChild(track.attach())
          }
        })
      })

      // Log new Participants as they connect to the Room
      room.once('participantConnected', (participant) => {
        console.log(`Participant "${participant.identity}" has connected to the Room`)
      })

      // Log Participants as they disconnect from the Room
      room.once('participantDisconnected', (participant) => {
        console.log(`Participant "${participant.identity}" has disconnected from the Room`)
      })

      room.on('participantConnected', (participant) => {
        console.log(`Participant "${participant.identity}" connected`)

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

      room.on('participantDisconnected', (participant) => {
        console.log(`Participant disconnected: ${participant.identity}`)
        document.getElementById('remote-media-div').innerHTML = ''
      })

      room.participants.forEach((participant) => {
        participant.tracks.forEach((publication) => {
          if (publication.track) {
            document.getElementById('remote-media-div').appendChild(publication.track.attach())
          }
        })

        participant.on('trackSubscribed', (track) => {
          document.getElementById('remote-media-div').appendChild(track.attach())
        })
      })

      room.on('disconnected', (room) => {
        // Detach the local media elements
        room.localParticipant.tracks.forEach((publication) => {
          const attachedElements = publication.track.detach()
          attachedElements.forEach((element) => element.remove())
        })
      })

      window.addEventListener('beforeunload', () => room.disconnect())
    })

  return (
    <div className={classes.videoWrapper}>
      <div id="my-video" className={classes.myVideo} />
      <div id="remote-media-div" className={classes.mainVid} />
    </div>
  )
}

export default MainVideo
