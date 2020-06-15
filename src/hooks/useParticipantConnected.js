import { useRemoteTrackPublished } from '.'

const useParticipantConnected = () => {
  const { remoteTrackPublished } = useRemoteTrackPublished()

  const participantConnected = (participant) => {
    participant.tracks.forEach((publication) => {
      remoteTrackPublished(publication, participant)
    })

    participant.on('trackPublished', (publication) => {
      console.log('onTrackPublished')

      remoteTrackPublished(publication, participant)
    })

    participant.on('trackUnpublished', (publication) => {})
  }
  return { participantConnected }
}

export default useParticipantConnected
