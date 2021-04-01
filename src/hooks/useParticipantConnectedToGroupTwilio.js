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
  return { participantConnectedToGroupTwilio }
}

export default useParticipantConnectedToGroupTwilio