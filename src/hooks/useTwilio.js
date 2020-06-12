import { useHistory } from 'react-router-dom'

import { useParticipantConnected } from '.'
import { useAppContext } from '../context/useAppContext'
import { constants } from '../utils'

const useTwilio = () => {
  const { user, event } = useAppContext()
  // const {
  //   room,
  //   currentRound,
  //   setVideoRouter,
  //   setDidPartnerDisconnect,
  //   setPartnerNeverConnected,
  // } = user
  const { userId } = user

  const history = useHistory()
  const { partnerCameraIssueTimeout } = constants

  const { participantConnected } = useParticipantConnected()
  const startTwilio = (room) => {
    // setVideoRouter(null)
    // setPartnerNeverConnected(false)

    // check to see if your partner joins within 30 seconds. If not, we assume
    // that they are having trouble connecting (camera permission issues)
    // setTimeout(() => {
    //   if (!room.participants.size) {
    //     setPartnerNeverConnected(true)
    //     setVideoRouter(true)
    //   }
    // }, partnerCameraIssueTimeout)
    if (room) {
      const { current_round } = event
      const { localParticipant } = room

      localParticipant.tracks.forEach((publication) => {
        const localDiv = document.getElementById('local-video')
        if (localDiv && !localDiv.children.length && publication.track.kind === 'video') {
          const attachedTrack = publication.track.attach()
          localDiv.appendChild(attachedTrack)
        }
      })

      room.participants.forEach(participantConnected)
      console.log('startTwilio -> room.participants', room.participants)

      room.on('participantConnected', (remoteParticipant) => {
        console.log('startTwilio -> remoteParticipant', remoteParticipant)
        // setPartnerNeverConnected(false)
        // setVideoRouter(null)
        participantConnected(remoteParticipant)
      })

      room.on('participantDisconnected', (remoteParticipant) => {
        console.log('remote participant disconnected ', remoteParticipant)
        // setDidPartnerDisconnect(true)
        const remoteVideo = document.getElementById('remote-video')
        if (remoteVideo) {
          remoteVideo.innerHTML = ''
        }
      })

      window.addEventListener('beforeunload', () => {
        // just some cleanup on partnerDisconnect
        // setDidPartnerDisconnect(false)
        room.disconnect()
      })

      room.on('disconnected', function (rum) {
        // just some cleanup on partnerDisconnect
        // setDidPartnerDisconnect(false)
        // setVideoRouter(true)
        console.log('process.env.REACT_APP_NUM_ROUNDS = ', process.env.REACT_APP_NUM_ROUNDS)

        if (parseInt(current_round, 10) === parseInt(process.env.REACT_APP_NUM_ROUNDS, 10)) {
          history.push('/event-complete')
        }
        rum.localParticipant.tracks.forEach(function (track) {
          track.unpublish()
        })

        const remoteVideo = document.getElementById('remote-video')
        if (remoteVideo) {
          remoteVideo.innerHTML = ''
        }
      })
    }
  }

  return { startTwilio }
}

export default useTwilio
