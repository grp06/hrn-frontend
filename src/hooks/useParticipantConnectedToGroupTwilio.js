import useRemoteTrackPublishedToGroupTwilio from './useRemoteTrackPublishedToGroupTwilio'

const useParticipantConnectedToGroupTwilio = () => {
  const { remoteTrackPublished } = useRemoteTrackPublishedToGroupTwilio()

  const participantConnectedToGroupTwilio = (participant) => {
    // when we join a room -- we need to loop over all participants
    participant.tracks.forEach((publication) => {
      remoteTrackPublished(publication, participant.identity)
    })
    // when other people join after we're already there
    participant.on('trackPublished', (publication) => {
      remoteTrackPublished(publication, participant.identity)
      const participantsMicOffIconDiv = document.getElementById(
        `${participant.identity}-mic-off-icon-div`
      )
      if (publication.kind === 'audio' && participantsMicOffIconDiv) {
        participantsMicOffIconDiv.style.display = 'none'
      }
    })

    participant.on('trackUnpublished', (publication) => {
      const videoGrid = document.getElementById('videoBox')
      const participantsDiv = document.getElementById(participant.identity)
      const participantsVideoDiv = document.getElementById(`${participant.identity}-video`)
      if (publication.kind === 'video' && participantsVideoDiv) {
        participantsVideoDiv.parentNode.removeChild(participantsVideoDiv)
        videoGrid.insertBefore(participantsDiv, videoGrid.lastChild.nextSibling)
      }
    })

    participant.on('trackDisabled', (publication) => {
      if (publication.kind === 'video') {
        const participantsVideoDiv = document.getElementById(participant.identity)
        participantsVideoDiv.style.display = 'none'
      }
      const participantsMicOffIconDiv = document.getElementById(
        `${participant.identity}-mic-off-icon-div`
      )
      if (publication.kind === 'audio' && participantsMicOffIconDiv) {
        participantsMicOffIconDiv.style.display = 'inline'
      }
    })

    participant.on('trackEnabled', (publication) => {
      if (publication.kind === 'video') {
        const participantsVideoDiv = document.getElementById(participant.identity)
        participantsVideoDiv.style.display = 'inline-flex'
      }
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
  return { participantConnectedToGroupTwilio }
}

export default useParticipantConnectedToGroupTwilio
