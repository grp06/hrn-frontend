const useRemoteTrackPublishedToGroupTwilio = () => {
  const remoteTrackPublished = (publication, participantsId) => {
    if (publication.isSubscribed) {
      const videoGrid = document.getElementById('videoBox')
      const participantsVideoDiv = document.getElementById(participantsId)
      if (publication.kind === 'video' && participantsVideoDiv) {
        const attachedTrack = publication.track.attach()
        attachedTrack.setAttribute('id', `${participantsId}-video`)
        attachedTrack.muted = true
        participantsVideoDiv.appendChild(attachedTrack)
        videoGrid.insertBefore(participantsVideoDiv, videoGrid.firstChild.nextSibling)
      }
    }

    publication.on('subscribed', async (track) => {
      const attachedTrack = track.attach()
      const participantsVideoDiv = document.getElementById(participantsId)
      const videoGrid = document.getElementById('videoBox')
      if (publication.kind === 'video' && participantsVideoDiv) {
        attachedTrack.muted = true
        attachedTrack.setAttribute('id', `${participantsId}-video`)
        console.log('subscribed, attaching track')
        participantsVideoDiv.appendChild(attachedTrack)
        videoGrid.insertBefore(participantsVideoDiv, videoGrid.firstChild.nextSibling)
      }
    })

    publication.on('unsubscribed', (track) => {})
  }
  return { remoteTrackPublished }
}

export default useRemoteTrackPublishedToGroupTwilio
