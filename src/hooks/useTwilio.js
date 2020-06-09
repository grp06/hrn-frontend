import { useHistory } from 'react-router-dom'

import { useParticipantConnected } from '.'
import { useGameContext } from '../context/useGameContext'
import { constants } from '../utils'

const useTwilio = () => {
  const {
    room,
    currentRound,
    setWaitingRoom,
    setDidPartnerDisconnect,
    setPartnerNeverConnected,
  } = useGameContext()
  const history = useHistory()
  const { partnerCameraIssueTimeout } = constants

  const { participantConnected } = useParticipantConnected()
  const startTwilio = () => {
    if (room) {
      setWaitingRoom(null)
      setPartnerNeverConnected(false)

      // check to see if your partner joins within 30 seconds. If not, we assume
      // that they are having trouble connecting (camera permission issues)
      setTimeout(() => {
        console.log('setTimeout useTwilio')
        console.log('room ->', room)
        console.log('room participants length ->', room.participants.size)
        if (!room.participants.size) {
          setPartnerNeverConnected(true)
          setWaitingRoom(true)
        }
      }, partnerCameraIssueTimeout)

      const { localParticipant } = room
      localParticipant.tracks.forEach((publication) => {
        console.log('publication = ', publication)
        console.log('startTwilio -> publication.kind', publication.kind)
        const localDiv = document.getElementById('local-video')
        if (localDiv && !localDiv.children.length && publication.track.kind === 'video') {
          const attachedTrack = publication.track.attach()
          localDiv.appendChild(attachedTrack)
        }
      })

      room.participants.forEach(participantConnected)
      room.on('participantConnected', participantConnected)

      room.on('participantDisconnected', (remoteParticipant) => {
        console.log('remote participant disconnected ', remoteParticipant)
        setDidPartnerDisconnect(true)
        const remoteVideo = document.getElementById('remote-video')
        if (remoteVideo) {
          remoteVideo.innerHTML = ''
        }
      })

      window.addEventListener('beforeunload', () => {
        // just some cleanup on partnerDisconnect
        setDidPartnerDisconnect(false)
        room.disconnect()
      })

      room.on('disconnected', function (rum) {
        // just some cleanup on partnerDisconnect
        setDidPartnerDisconnect(false)
        setWaitingRoom(true)
        // hardcoding this for our test
        console.log('process.env.REACT_APP_NUM_ROUNDS = ', process.env.REACT_APP_NUM_ROUNDS)

        if (parseInt(currentRound, 10) === parseInt(process.env.REACT_APP_NUM_ROUNDS, 10)) {
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
