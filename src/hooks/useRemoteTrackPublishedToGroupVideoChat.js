const useRemoteTrackPublishedToGroupVideoChat = () => {
  const remoteTrackPublished = (publication, participantsId) => {
    if (publication.isSubscribed) {
      const participantsVideoDiv = document.getElementById(participantsId)
      if (publication.kind === 'video' && participantsVideoDiv) {
        const attachedTrack = publication.track.attach()
        attachedTrack.muted = true

        participantsVideoDiv.appendChild(attachedTrack)
      }
    }

    publication.on('subscribed', async (track) => {
      const attachedTrack = track.attach()
      if (publication.kind === 'video') {
        attachedTrack.muted = true
        console.log('subscribed, attaching track')
        document.getElementById(participantsId).appendChild(attachedTrack)
      }
    })

    publication.on('unsubscribed', (track) => {})
  }
  return { remoteTrackPublished }
}

export default useRemoteTrackPublishedToGroupVideoChat
