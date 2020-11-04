import useRemoteTrackPublishedToGroupVideoChat from './useRemoteTrackPublishedToGroupVideoChat'

const useParticipantConnectedToGroupVideoChat = () => {
  const { remoteTrackPublished } = useRemoteTrackPublishedToGroupVideoChat()

  const participantConnectedToGroupVideoChat = (participant) => {
    // when we join a room -- we need to loop over all participants
    participant.tracks.forEach((publication) => {
      remoteTrackPublished(publication, participant.identity)
    })
    // when other people join after we're already there
    participant.on('trackPublished', (publication) => {
      remoteTrackPublished(publication, participant.identity)
    })

    participant.on('trackUnpublished', (publication) => {
      const participantsVideoDiv = document.getElementById(`${participant.identity}-video`)
      if (publication.kind === 'video' && participantsVideoDiv) {
        participantsVideoDiv.parentNode.removeChild(participantsVideoDiv)
      }
    })

    // we only disable and enable audio tracks
    participant.on('trackDisabled', (publication) => {
      const participantsMicOffIconDiv = document.getElementById(
        `${participant.identity}-mic-off-icon-div`
      )
      if (publication.kind === 'audio' && participantsMicOffIconDiv) {
        participantsMicOffIconDiv.style.display = 'inline'
      }
    })

    participant.on('trackEnabled', (publication) => {
      const participantsMicOffIconDiv = document.getElementById(
        `${participant.identity}-mic-off-icon-div`
      )
      if (publication.kind === 'audio' && participantsMicOffIconDiv) {
        participantsMicOffIconDiv.style.display = 'none'
      }
    })

    // participant.on('trackSubscriptionFailed', (error, publication) => {

    // })

    // participant.on('disconnected', (participant) => {

    // })
  }
  return { participantConnectedToGroupVideoChat }
}

export default useParticipantConnectedToGroupVideoChat
