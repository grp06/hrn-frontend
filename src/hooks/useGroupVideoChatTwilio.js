import { useParticipantConnected } from '.'

const useGroupVideoChatTwilio = () => {
  const { participantConnected } = useParticipantConnected()

  const startGroupVideoChatTwilio = (room) => {
    window.room = room
    if (room) {
      console.log('room ->', room)
      const { localParticipant, participants } = room
      console.log('localParticipant ->', localParticipant)
      console.log('participants ->', participants)
    }
  }

  return { startGroupVideoChatTwilio }
}

export default useGroupVideoChatTwilio
