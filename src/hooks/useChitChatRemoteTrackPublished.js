const useChitChatRemoteTrackPublished = () => {
  const chitChatRemoteTrackPublished = (publication) => {
    if (publication.isSubscribed) {
      const remoteDiv = document.getElementById('remote-video')
      if (publication.kind === 'video' && remoteDiv) {
        const attachedTrack = publication.track.attach()
        attachedTrack.muted = true

        remoteDiv.appendChild(attachedTrack)
      }
    }

    publication.on('subscribed', async (track) => {
      const attachedTrack = track.attach()
      if (publication.kind === 'video') {
        attachedTrack.muted = true
        console.log('subscribed, attaching track')
        document.getElementById('remote-video').appendChild(attachedTrack)
      }
    })

    publication.on('unsubscribed', (track) => {})
  }
  return { chitChatRemoteTrackPublished }
}

export default useChitChatRemoteTrackPublished
