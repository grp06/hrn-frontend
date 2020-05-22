import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { MainVideo } from '../components'
import { useGameContext } from '../context/useGameContext'
import endpointUrl from '../utils/endpointUrl'

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
const {
  connect,
  createLocalTracks,
  createLocalVideoTrack,
  createLocalAudioTrack,
} = require('twilio-video')

const UserControl = () => {
  const classes = useStyles()
  const [myRoomId, setMyRoomId] = useState('')
  const [partner, setPartner] = useState('')

  const { currentRound, userId, roundsData } = useGameContext()
  const joinRoom = () => {
    if (roundsData && roundsData.rounds && roundsData.rounds.length && currentRound) {
      const myRound = roundsData.rounds.find((round) => {
        const me =
          round.round_number === currentRound &&
          (round.partnerX_id === parseInt(userId, 10) || round.partnerY_id === parseInt(userId, 10))
        return me
      })
      const roomId = myRound.id
      setMyRoomId(roomId)
      fetch(`${endpointUrl}/api/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId, myUserId: userId }),
      })
        .then((res) => res.json())
        .then(({ token }) => {
          connect(token, {
            name: roomId,
            audio: false,
          }).then(function (room) {
            // Add video after connecting to the Room
            createLocalVideoTrack().then(function (localTrack) {
              localTrack.enable()

              room.localParticipant.publishTrack(localTrack)
            })
            room.participants.forEach((remoteParticipant) => {
              setPartner(remoteParticipant.identity)

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
              setPartner(remoteParticipant.identity)
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
              console.log('remoteParticipant = ', remoteParticipant)
              const remoteDiv = document.getElementById('remote-media-div')
              if (remoteDiv) {
                remoteDiv.innerHTML = ''
              }
            })
            // when you disconnect, stop our track and detach them
            window.addEventListener('beforeunload', () => {
              console.log('disconnect!')
              room.disconnect()
            })
            room.on('disconnected', function (rum, error) {
              console.log('I just disconnected = ', rum)
              if (error) {
                console.log('Unexpectedly disconnected:', error)
              }
              rum.localParticipant.tracks.forEach(function (track) {
                console.log('disconnected')
                track.unpublish()
              })
              const remoteDiv = document.getElementById('remote-media-div')
              if (remoteDiv) {
                remoteDiv.innerHTML = ''
              }
            })
          })
        })
    }
  }
  return (
    <div>
      <button onClick={joinRoom}>Join Room</button>
      <div>my room id ={myRoomId}</div>
      <div>
        my partner:
        {partner}
      </div>
      <div className={classes.videoWrapper}>
        <div id="my-video" className={classes.myVideo} />
        <div id="remote-media-div" className={classes.mainVid} />
      </div>
    </div>
  )
  // return (
  //   <>
  //     <MainVideo />
  //   </>
  // )
}
export default UserControl
