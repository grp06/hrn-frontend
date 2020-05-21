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

  // Option 1
  useEffect(() => {
    if (token) {
      createLocalTracks({
        audio: false,
        video: { width: 640 },
      })
        .then((localTracks) => {
          console.log('localTracks = ', localTracks)
          console.log(token)
          return connect(token, {
            video: true,
            name: partnerX,
            tracks: localTracks,
          })
        })
        .then((room) => {
          console.log(`Connected to Room: ${room.name}`)

          // Log your Client's LocalParticipant in the Room
          const { localParticipant } = room
          console.log(`Connected to the Room as LocalParticipant "${localParticipant.identity}"`)

          // localParticipant.tracks.forEach((localTrackPublication) => {
          //   debugger
          //   if (localTrackPublication.isP)
          // })

          // localParticipant.publishTrack(localTrack).then((localTrackPublication) => {
          //   console.log(
          //     `Track ${localTrackPublication.name} was published with SID ${localTrackPublication.tracksid}`
          //   )
          // })

          // when participant connects, grab their published and subscribed tracks
          // and append to remote-media-div

          room.on('participantConnected', (participant) => {
            console.log(`Participant "${participant.identity}" connected`)

            participant.tracks.forEach((publication) => {
              if (publication.isSubscribed) {
                console.log('publication.isSubscribed')
                const { track } = publication
                document.getElementById('remote-media-div').appendChild(track.attach())
              }
            })

            participant.on('trackSubscribed', (track) => {
              console.log('trackSubscribed')
              document.getElementById('remote-media-div').appendChild(track.attach())
            })
          })

          // Log any Participants already connected to the Room
          room.participants.forEach((participant) => {
            console.log('MainVideo -> participant', participant)
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

          room.on('participantDisconnected', (participant) => {
            console.log(`Participant disconnected: ${participant.identity}`)
            const remoteDiv = document.getElementById('remote-media-div')
            if (remoteDiv) {
              remoteDiv.innerHTML = ''
            }
          })

          room.participants.forEach((participant) => {
            console.log('participant = ', participant)
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
    }
  }, [token])

  if (!roundsData) {
    return <div>nothing</div>
  }
  if (!token || !partnerX) {
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
