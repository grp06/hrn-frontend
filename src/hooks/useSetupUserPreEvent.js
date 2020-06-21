import { useParticipantConnected } from '.'
import { useAppContext } from '../context/useAppContext'

const useSetupUserPreEvent = () => {
  const { user } = useAppContext()
  const { role } = user
  const { participantConnected } = useParticipantConnected()
  const setupUserPreEvent = (room) => {
    // nothing to loop over for the host
    room.participants.forEach(participantConnected)

    room.on('participantConnected', (remoteParticipant) => {
      console.log('ON --- participantConnected', remoteParticipant)
      participantConnected(remoteParticipant)
    })

    room.on('participantDisconnected', (remoteParticipant) => {
      console.log('ON --- participantDisconnected', remoteParticipant)

      // if you're watching the host and he disconnects, tear down his video
      if (role !== 'host') {
        const hostVideo = document.getElementById('host-video')
        if (hostVideo) {
          hostVideo.innerHTML = ''
        }
      }
    })
  }

  return { setupUserPreEvent }
}

export default useSetupUserPreEvent
