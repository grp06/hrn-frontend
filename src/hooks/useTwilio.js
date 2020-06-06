import { useHistory } from 'react-router-dom'

import { useParticipantConnected } from '.'
import { useGameContext } from '../context/useGameContext'

const useTwilio = () => {
  const { room, currentRound, setWaitingRoom, setDidPartnerDisconnect } = useGameContext()
  const history = useHistory()

  const { participantConnected } = useParticipantConnected()
  const startTwilio = () => {
    if (room) {
      setWaitingRoom(null)

      const { localParticipant } = room
      localParticipant.tracks.forEach((publication) => {
        console.log('publication = ', publication)
        const localDiv = document.getElementById('local-video')
        if (localDiv && !localDiv.children.length) {
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
