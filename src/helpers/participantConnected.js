const remoteTrackPublished = (publication, participant) => {
  console.log('publication', publication)
  if (publication.isSubscribed) {
    console.log('publication.isSubscribed ', publication.isSubscribed)
    const remoteDiv = document.getElementById('remote-video')
    if (remoteDiv) {
      const attachedTrack = publication.track.attach()
      attachedTrack.muted = true
      remoteDiv.appendChild(attachedTrack)
    }
  }
  publication.on('subscribed', (track) => {
    console.log('subscribed -> track', track)
    const attachedTrack = track.attach()
    attachedTrack.muted = true
    document.getElementById('remote-video').appendChild(attachedTrack)
  })

  publication.on('unsubscribed', (track) => {
    console.log('publication.on unsubscribed ', track)
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
