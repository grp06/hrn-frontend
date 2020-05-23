const remoteTrackPublished = (publication, participant) => {
  if (publication.isSubscribed) {
    const remoteDiv = document.getElementById('remote-media-div')
    if (remoteDiv) {
      const attachedTrack = publication.track.attach()
      remoteDiv.appendChild(attachedTrack)
    }
  }
  publication.on('subscribed', (track) => {
    const attachedTrack = track.attach()
    document.getElementById('remote-media-div').appendChild(attachedTrack)
  })

  publication.on('unsubscribed', (track) => {
    console.log('publication.on unsubscribed')
  })
}

const participantConnected = (participant) => {
  participant.tracks.forEach((publication) => {
    remoteTrackPublished(publication, participant)
  })

  participant.on('trackPublished', (publication) => {
    remoteTrackPublished(publication, participant)
  })

  participant.on('trackUnpublished', (publication) => {
    console.log(
      `RemoteParticipant ${participant.identity} unpublished a RemoteTrack: ${publication}`
    )
  })
}

export default participantConnected
