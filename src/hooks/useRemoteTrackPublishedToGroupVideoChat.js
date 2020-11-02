const useRemoteTrackPublishedToGroupVideoChat = () => {
  const remoteTrackPublished = (publication, participantsId) => {
    if (publication.isSubscribed) {
      const participantsVideoDiv = document.getElementById(participantsId)
      if (publication.kind === 'video' && participantsVideoDiv) {
        const attachedTrack = publication.track.attach()
        attachedTrack.setAttribute('id', `${participantsId}-video`)
        attachedTrack.muted = true
        participantsVideoDiv.appendChild(attachedTrack)
      }
    }

    publication.on('subscribed', async (track) => {
      const attachedTrack = track.attach()
      const participantsVideoDiv = document.getElementById(participantsId)
      if (publication.kind === 'video' && participantsVideoDiv) {
        attachedTrack.muted = true
        attachedTrack.setAttribute('id', `${participantsId}-video`)
        console.log('subscribed, attaching track')
        participantsVideoDiv.appendChild(attachedTrack)
      }
    })

    publication.on('unsubscribed', (track) => {})
  }
  return { remoteTrackPublished }
}

export default useRemoteTrackPublishedToGroupVideoChat
