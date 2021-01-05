import { useParticipantConnectedToGroupVideoChat } from '.'

const useGroupVideoChatTwilio = () => {
  const { participantConnectedToGroupVideoChat } = useParticipantConnectedToGroupVideoChat()

  const startGroupVideoChatTwilio = (room) => {
    let dominantSpeakerId
    window.room = room
    if (room) {
      console.log('room ->', room)
      const { localParticipant, participants } = room

      // publish our own tracks
      localParticipant.tracks.forEach((publication) => {
        const localParticipantsVideoDiv = document.getElementById(localParticipant.identity)
        if (localParticipantsVideoDiv && publication.track.kind === 'video') {
          const attachedTrack = publication.track.attach()
          attachedTrack.style.transform = 'scale(-1, 1)'
          attachedTrack.setAttribute('id', `${localParticipant.identity}-video`)
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
        const participantsVideoDiv = document.getElementById(`${remoteParticipant.identity}-video`)
        // instead of modifying the innerHTML, detatch instead
        if (participantsVideoDiv) {
          participantsVideoDiv.parentNode.removeChild(participantsVideoDiv)
        }
      })

      room.on('disconnected', (rum, error) => {
        window.room = null
        rum.localParticipant.tracks.forEach(function (track) {
          console.log('ya boi is unpublishing')
          track.unpublish()
        })
        if (error) {
          console.log('Unexpectedly disconnected:', error)
        }
      })

      room.on('dominantSpeakerChanged', (dominantSpeaker) => {
        const newDominantSpeakerId = dominantSpeaker && dominantSpeaker.identity
        if (!dominantSpeaker) {
          // the old dominantSpeaker muted
          const oldDominantSpeakersDiv =
            dominantSpeakerId && document.getElementById(dominantSpeakerId)
          if (oldDominantSpeakersDiv) {
            oldDominantSpeakersDiv.style.border = ''
            oldDominantSpeakersDiv.style.boxShadow = ''
          }
        }
        if (newDominantSpeakerId !== dominantSpeakerId) {
          const oldDominantSpeakersDiv =
            dominantSpeakerId && document.getElementById(dominantSpeakerId)
          const participantsDiv = document.getElementById(`${dominantSpeaker.identity}`)
          if (oldDominantSpeakersDiv) {
            oldDominantSpeakersDiv.style.border = ''
            oldDominantSpeakersDiv.style.boxShadow = ''
          }
          if (participantsDiv) {
            participantsDiv.style.border = '1.5px solid #fabb5b'
          }
          dominantSpeakerId = newDominantSpeakerId
        }
      })

      window.addEventListener('beforeunload', () => {
        room.disconnect()
        console.log('disconnecting from room')
        window.room = null
      })
    }
  }

  return { startGroupVideoChatTwilio }
}

export default useGroupVideoChatTwilio
