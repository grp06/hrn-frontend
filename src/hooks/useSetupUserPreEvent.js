import { useParticipantConnected } from '.'
import { useAppContext } from '../context/useAppContext'

const useSetupUserPreEvent = () => {
  const { user, event } = useAppContext()
  const { participantConnected } = useParticipantConnected()
  const setupUserPreEvent = (room) => {
    // nothing to loop over for the host
    room.participants.forEach(participantConnected)
    console.log('setupUserPreEvent -> room.participants', room.participants)

    room.on('participantConnected', (remoteParticipant) => {
      console.log('ON --- participantConnected', remoteParticipant)
      participantConnected(remoteParticipant)
    })

    room.on('participantDisconnected', (remoteParticipant) => {
      const { host_id } = event
      console.log('someone disconnectd')
      console.log('setupUserPreEvent -> host_id', host_id)
      console.log('setupUserPreEvent -> remoteParticipant.identity', remoteParticipant.identity)
      if (parseInt(remoteParticipant.identity, 10) === host_id) {
        const hostVideo = document.getElementById('host-video')
        console.log('setupUserPreEvent -> hostVideo', hostVideo)
        if (hostVideo) {
          // instead of just giving them a black screen, give them something if the host disconnects...
          hostVideo.innerHTML = 'waiting for host connect'
        }
      }
    })
  }

  return { setupUserPreEvent }
}

export default useSetupUserPreEvent
