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
    })
  }

  return { setupUserPreEvent }
}

export default useSetupUserPreEvent
