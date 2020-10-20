import { useRemoteTrackPublished } from '.'

const useParticipantConnected = () => {
  const { remoteTrackPublished } = useRemoteTrackPublished()

  const participantConnected = (participant) => {
    // when we join a room -- we need to loop over all participants
    participant.tracks.forEach((publication) => {
      remoteTrackPublished(publication)
    })
    // when other people join after we're already there
    participant.on('trackPublished', (publication) => {
      remoteTrackPublished(publication)
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
  return { participantConnected }
}

export default useParticipantConnected
