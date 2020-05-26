const remoteTrackPublished = (publication, participant) => {
  if (publication.isSubscribed) {
    const remoteDiv = document.getElementById('remote-video')
    if (remoteDiv) {
      const attachedTrack = publication.track.attach()
      attachedTrack.muted = true
      console.log('remoteTrackPublished -> about to attach', publication)
      remoteDiv.appendChild(attachedTrack)
    }
  }
  publication.on('subscribed', (track) => {
    console.log('remoteTrackPublished subscribed -> track', track)
    const attachedTrack = track.attach()
    attachedTrack.muted = true
    if (!track.isStarted) {
      const button = document.createElement('button')
      button.innerHTML = 'Having some trouble. Click to refresh'
      button.addEventListener('click', () => {
        window.location.reload()
      })
      document.getElementById('remote-video').appendChild(button)
    } else {
      document.getElementById('remote-video').appendChild(attachedTrack)
    }
  })

  publication.on('unsubscribed', (track) => {
    console.log('remoteTrackPublished unsubscribed -> track', track)
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
