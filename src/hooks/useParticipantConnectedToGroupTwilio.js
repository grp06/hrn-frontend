import useRemoteTrackPublishedToGroupTwilio from './useRemoteTrackPublishedToGroupTwilio'
import { toggleParticipantsMicIcon } from '../utils'

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
      if (publication.kind === 'audio') {
        toggleParticipantsMicIcon(participant.identity, 'none')
      }
    })

    // when participants unpublish their tracks either by leaving stage or getting swept
    participant.on('trackUnpublished', (publication) => {
      const participantsDiv = document.getElementById(participant.identity)
      const participantsVideoElement = document.getElementById(`${participant.identity}-video`)
      if (publication.kind === 'video' && participantsDiv) {
        participantsVideoElement.remove()
        participantsDiv.style.display = 'none'
      }
    })

    // we only disable audio tracks for muting
    participant.on('trackDisabled', (publication) => {
      if (publication.kind === 'audio') {
        toggleParticipantsMicIcon(participant.identity, 'inline')
      }
    })

    // we only enable audio tracks for muting
    participant.on('trackEnabled', (publication) => {
      if (publication.kind === 'audio') {
        toggleParticipantsMicIcon(participant.identity, 'none')
      }
    })
  }
  return { participantConnectedToGroupTwilio }
}

export default useParticipantConnectedToGroupTwilio
