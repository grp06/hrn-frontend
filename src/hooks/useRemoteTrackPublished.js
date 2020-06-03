import { useGameContext } from '../context/useGameContext'

const useRemoteTrackPublished = () => {
  const remoteTrackPublished = (publication) => {
    if (publication.isSubscribed) {
      console.log('publication.isSubscribed ', publication.isSubscribed)
      const remoteDiv = document.getElementById('remote-video')
      if (remoteDiv) {
        const attachedTrack = publication.track.attach()
        if (publication.kind === 'video') {
          attachedTrack.muted = true
        }
        remoteDiv.appendChild(attachedTrack)
      }
    }
    publication.on('subscribed', (track) => {
      console.log('subscribed -> track', track)
      const attachedTrack = track.attach()
      if (publication.kind === 'video') {
        attachedTrack.muted = true
      }
      document.getElementById('remote-video').appendChild(attachedTrack)
    })

    publication.on('unsubscribed', (track) => {
      console.log('publication.on unsubscribed ', track)
    })
  }
  return { remoteTrackPublished }
}

export default useRemoteTrackPublished
