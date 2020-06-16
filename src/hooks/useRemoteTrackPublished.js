import { useAppContext } from '../context/useAppContext'

const useRemoteTrackPublished = () => {
  const { setDidPartnerDisconnect, setVideoRouter } = useAppContext()
  const remoteTrackPublished = (publication) => {
    if (publication.isSubscribed) {
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
      console.log('onSubscribed')
      const attachedTrack = track.attach()
      if (publication.kind === 'video') {
        attachedTrack.muted = true
      }
      document.getElementById('remote-video').appendChild(attachedTrack)
      // setDidPartnerDisconnect(false)
    })

    publication.on('unsubscribed', (track) => {})
  }
  return { remoteTrackPublished }
}

export default useRemoteTrackPublished
