const useRemoteTrackPublishedToGroupTwilio = () => {
  const remoteTrackPublished = (publication, participantsId) => {
    console.log('🚀 ~ remoteTrackPublished ~ publication', publication)
    console.log('🚀 ~ remoteTrackPublished ~ participantsId', participantsId)
    if (publication.isSubscribed) {
      const videoGrid = document.getElementById('videoBox')
      const participantsVideoDiv = document.getElementById(participantsId)
      if (publication.kind === 'video' && participantsVideoDiv) {
        console.log('🚀 ~ remoteTrackPublished ~ publication', publication)
        participantsVideoDiv.style.display = 'inline-flex'
        const attachedTrack = publication.track.attach()
        attachedTrack.setAttribute('id', `${participantsId}-video`)
        attachedTrack.muted = true
        participantsVideoDiv.appendChild(attachedTrack)
        console.log('insert before')
        videoGrid.insertBefore(participantsVideoDiv, videoGrid.firstChild.nextSibling)
      }
    }

    publication.on('subscribed', async (track) => {
      if (publication.kind === 'data') {
        return
      }
      const attachedTrack = track.attach()
      const participantsVideoDiv = document.getElementById(participantsId)
      const videoGrid = document.getElementById('videoBox')
      if (publication.kind === 'video' && participantsVideoDiv) {
        participantsVideoDiv.style.display = 'inline-flex'
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
