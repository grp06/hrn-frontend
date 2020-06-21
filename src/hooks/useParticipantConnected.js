import { useRemoteTrackPublished } from '.'

const useParticipantConnected = () => {
  const { remoteTrackPublished } = useRemoteTrackPublished()

  const participantConnected = (participant) => {
    console.log('room.participants.forEach')

    participant.tracks.forEach((publication) => {
      console.log('looping over remote tracks')

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
