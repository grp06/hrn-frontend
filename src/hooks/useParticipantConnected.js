import { useRemoteTrackPublished } from '.'

const useParticipantConnected = () => {
  const { remoteTrackPublished } = useRemoteTrackPublished()

  const participantConnected = (participant) => {
    participant.tracks.forEach((publication) => {
      console.log('useParticipantConnected -> publication', publication)

      remoteTrackPublished(publication, participant)
    })

    participant.on('trackPublished', (publication) => {
      console.log('useParticipantConnected -> publication', publication)
      remoteTrackPublished(publication, participant)
    })

    participant.on('trackUnpublished', (publication) => {
      console.log(
        `RemoteParticipant ${participant.identity} unpublished a RemoteTrack: ${publication}`
      )
    })
  }
  return { participantConnected }
}

export default useParticipantConnected
