import { useChitChatRemoteTrackPublished } from '.'

const useChitChatParticipantConnected = () => {
  const { chitChatRemoteTrackPublished } = useChitChatRemoteTrackPublished()

  const chitChatParticipantConnected = (participant) => {
    // when we join a room -- we need to loop over all participants
    participant.tracks.forEach((publication) => {
      chitChatRemoteTrackPublished(publication)
    })
    // when other people join after we're already there
    participant.on('trackPublished', (publication) => {
      chitChatRemoteTrackPublished(publication)
    })

    participant.on('trackUnpublished', (publication) => {
      const remoteVideo = document.getElementById('remote-video')
      if (publication.kind === 'video' && remoteVideo) {
        remoteVideo.innerHTML = ''
      }
    })

    // participant.on('trackSubscriptionFailed', (error, publication) => {

    // })

    // participant.on('disconnected', (participant) => {

    // })
  }
  return { chitChatParticipantConnected }
}

export default useChitChatParticipantConnected
