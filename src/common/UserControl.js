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
        .then(async ({ token }) => {
          const videoTrack = await createLocalVideoTrack()

          const room = await connect(token, {
            name: roomId,
            tracks: [videoTrack],
          })

          const { localParticipant } = room
          function trackPublished(publication) {
            console.log(`Published LocalTrack: ${publication.track}`)
          }

          // Access the already published LocalTracks.
          localParticipant.tracks.forEach(trackPublished)

          function remoteTrackPublished(publication, participant) {
            console.log(
              `RemoteParticipant ${participant.identity} published a RemoteTrack: `,
              publication
            )
            if (publication.isSubscribed) {
              console.log('publication.isSubscribed = true. Going to append')
              console.log('publication.track = ', publication.track)
              const remoteDiv = document.getElementById('remote-media-div')
              if (remoteDiv) {
                const attachedTrack = publication.track.attach()
                remoteDiv.appendChild(attachedTrack)
              }
            }
            publication.on('subscribed', (track) => {
              console.log(`LocalParticipant subscribed to a RemoteTrack: `, track)
              console.log('publication.on Subscribed fired. Going to append')
              const attachedTrack = track.attach()
              document.getElementById('remote-media-div').appendChild(attachedTrack)
            })

            publication.on('unsubscribed', (track) => {
              console.log(`LocalParticipant unsubscribed from a RemoteTrack: `, track)
            })
          }

          function participantConnected(participant) {
            console.log('setting identity')
            setPartner(participant.identity)

            participant.tracks.forEach((publication) => {
              remoteTrackPublished(publication, participant)
            })
            // A RemoteTrack was published by the RemoteParticipant after connecting
            // to the Room. This event is not emitted for RemoteTracks that were published
            // while the RemoteParticipant was connecting to the Room.
            participant.on('trackPublished', (publication) => {
              remoteTrackPublished(publication, participant)
            })

            participant.on('trackUnpublished', (publication) => {
              console.log(
                `RemoteParticipant ${participant.identity} unpublished a RemoteTrack: ${publication}`
              )
            })
          }

          room.participants.forEach(participantConnected)
          room.on('participantConnected', participantConnected)

          // I don't get the difference between
          // participant.trackPublications
          // and participant.tracks
          // room.on('participantConnected', (participant) => {
          //   // Handle RemoteTracks published while connecting to the Room.
          //   participant.trackPublications.forEach(trackPublished)
          // })

          // room.on('participantConnected', function (remoteParticipant) {
          //   // not sure why we need trackSubscribed here?
          //   // if we're listening for published tracks previously
          //   remoteParticipant.on('trackSubscribed', (track) => {
          //     const remoteDiv = document.getElementById('remote-media-div')
          //     if (remoteDiv) {
          //       const attachedTrack = track.attach()
          //       remoteDiv.appendChild(attachedTrack)
          //     }
          //   })
          // })

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
