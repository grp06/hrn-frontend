import { useParticipantConnected } from '.'
import { useGameContext } from '../context/useGameContext'

const useTwilio = () => {
  const { room, twilioReady, setTwilioReady, setRoom, setConnecting } = useGameContext()
  const { participantConnected } = useParticipantConnected()
  const startTwilio = () => {
    if (room && twilioReady) {
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

        const remoteVideo = document.getElementById('remote-video')
        if (remoteVideo) {
          remoteVideo.innerHTML = ''
        }
      })

      window.addEventListener('beforeunload', () => {
        room.disconnect()
      })

      room.on('disconnected', function (rum) {
        console.log('disconnected... setting room to null, twilioReady to false')
        setRoom(null, false)
        rum.localParticipant.tracks.forEach(function (track) {
          track.unpublish()
        })

        const remoteVideo = document.getElementById('remote-video')
        if (remoteVideo) {
          remoteVideo.innerHTML = ''
        }
      })
      setTwilioReady(true)
      setConnecting(true)
    }
  }

  return { startTwilio }
}

export default useTwilio
