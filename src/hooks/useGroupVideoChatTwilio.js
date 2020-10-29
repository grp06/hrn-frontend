import { useParticipantConnectedToGroupVideoChat } from '.'

const useGroupVideoChatTwilio = () => {
  const { participantConnectedToGroupVideoChat } = useParticipantConnectedToGroupVideoChat()

  const startGroupVideoChatTwilio = (room) => {
    window.room = room
    if (room) {
      console.log('room ->', room)
      const { localParticipant, participants } = room

      // publish our own tracks
      localParticipant.tracks.forEach((publication) => {
        const localParticipantsVideoDiv = document.getElementById(localParticipant.identity)
        if (
          localParticipantsVideoDiv &&
          !localParticipantsVideoDiv.children.length &&
          publication.track.kind === 'video'
        ) {
          const attachedTrack = publication.track.attach()
          attachedTrack.style.transform = 'scale(-1, 1)'
          localParticipantsVideoDiv.appendChild(attachedTrack)
        }
      })

      // when we connect to a room, run 'participantConnected'
      // for each person who is already in the room when we arrive
      participants.forEach(participantConnectedToGroupVideoChat)

      // set up a listener to do some stuff when new people join the room
      room.on('participantConnected', (remoteParticipant) => {
        console.log('participantConnected', remoteParticipant)
        participantConnectedToGroupVideoChat(remoteParticipant)
      })

      room.on('participantDisconnected', (remoteParticipant) => {
        console.log('participantDisconnected', remoteParticipant)

        const participantsVideoDiv = document.getElementById(remoteParticipant.identity)
        // instead of modifying the innerHTML, detatch instead
        if (participantsVideoDiv) {
          participantsVideoDiv.innerHTML = ''
        }
      })
    }
  }

  return { startGroupVideoChatTwilio }
}

export default useGroupVideoChatTwilio
