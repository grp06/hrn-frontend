import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { MainVideo } from '../components'
import { useGameContext } from '../context/useGameContext'
import endpointUrl from '../utils/endpointUrl'
import { participantConnected, getToken } from '../helpers'

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

  const { currentRound, userId, roundsData } = useGameContext()
  console.log('userContol render = ')
  const joinRoom = async () => {
    if (roundsData && roundsData.rounds && roundsData.rounds.length && currentRound) {
      const myRound = roundsData.rounds.find((round) => {
        const me =
          round.round_number === currentRound &&
          (round.partnerX_id === parseInt(userId, 10) || round.partnerY_id === parseInt(userId, 10))
        return me
      })
      const roomId = myRound.id
      setMyRoomId(roomId)
      console.log('about to get token ')
      const res = await getToken(roomId, userId)
      console.log('joinRoom -> res', res)

      const { token } = await res.json()
      console.log('token = ', token)
      const videoTrack = await createLocalVideoTrack()

      const room = await connect(token, {
        name: roomId,
        tracks: [videoTrack],
      })

      const { localParticipant } = room

      localParticipant.tracks.forEach((publication) => {
        console.log(`Published LocalTrack: = `, publication.track)
      })

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
        console.log('room.on disconnected ', rum)
        rum.localParticipant.tracks.forEach(function (track) {
          track.unpublish()
        })

        const remoteDiv = document.getElementById('remote-media-div')
        if (remoteDiv) {
          remoteDiv.innerHTML = ''
        }
      })
    }
  }
  return (
    <div>
      <button onClick={joinRoom}>Join Room</button>
      <div>my room id ={myRoomId}</div>

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
