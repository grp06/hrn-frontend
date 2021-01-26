import { useChitChatParticipantConnected } from '.'
import { useChitChatContext } from '../context'
import { constants } from '../utils'

const useChitChatTwilio = () => {
  const { setFanDisconnectedFromChat, setFanNeverConnected } = useChitChatContext()
  const { partnerCameraIssueTimeout } = constants

  const { chitChatParticipantConnected } = useChitChatParticipantConnected()

  const startChitChatTwilio = (room) => {
    setFanNeverConnected(false)
    // check to see if your partner joins within 30 seconds. If not, we assume
    // that they are having trouble connecting (camera permission issues)
    setTimeout(() => {
      if (!room.participants.size) {
        setFanNeverConnected(true)
      }
    }, partnerCameraIssueTimeout)

    if (room) {
      const { localParticipant } = room

      localParticipant.tracks.forEach((publication) => {
        const localDiv = document.getElementById('local-video')
        if (localDiv && !localDiv.children.length && publication.track.kind === 'video') {
          const attachedTrack = publication.track.attach()
          attachedTrack.style.transform = 'scale(-1, 1)'
          localDiv.appendChild(attachedTrack)
        }
      })

      // when we connect to a room, run 'chitChatParticipantConnected'
      // for each person who is already in the room when we arrive
      room.participants.forEach(chitChatParticipantConnected)

      // set up a listener to do some stuff when new people join the room
      room.on('chitChatParticipantConnected', (remoteParticipant) => {
        console.log('chitChatParticipantConnected', remoteParticipant)
        setFanNeverConnected(false)
        setFanDisconnectedFromChat(false)
        chitChatParticipantConnected(remoteParticipant)
      })

      room.on('participantDisconnected', (remoteParticipant) => {
        console.log('participantDisconnected', remoteParticipant)
        setFanDisconnectedFromChat(true)
        const remoteVideo = document.getElementById('remote-video')
        // instead of modifying the innerHTML, detatch instead
        if (remoteVideo) {
          remoteVideo.innerHTML = ''
        }
      })

      window.addEventListener('beforeunload', () => {
        room.disconnect()
        console.log('disconnecting from room')
      })

      room.on('reconnecting', (error) => {
        if (error.code === 53001) {
          window.analytics.track('Twilio error 53001')
          console.log('Reconnecting your signaling connection!', error.message)
        } else if (error.code === 53405) {
          window.analytics.track('Twilio error 53405')
          console.log('Reconnecting your media connection!', error.message)
        }
      })

      // local participant disconnects

      room.on('disconnected', (rum, error) => {
        window.room = null
        setFanNeverConnected(false)
        setFanDisconnectedFromChat(false)
        rum.localParticipant.tracks.forEach(function (track) {
          console.log('ya boi is unpublishing')
          track.unpublish()
        })
        if (error) {
          console.log('Unexpectedly disconnected:', error)
        }
        const localDiv = document.getElementById('local-video')
        if (localDiv) {
          localDiv.innerHTML = ''
        }
        const remoteVideo = document.getElementById('remote-video')
        if (remoteVideo) {
          remoteVideo.innerHTML = ''
        }
      })
    }
  }

  return { startChitChatTwilio }
}

export default useChitChatTwilio
