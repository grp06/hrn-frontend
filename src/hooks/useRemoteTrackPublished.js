import { useAppContext } from '../context/useAppContext'
import { intentionalPause } from '../helpers'
import { constants } from '../utils'

const { hasPartnerAndIsConnectingBreathingRoom } = constants

const useRemoteTrackPublished = () => {
  const { setHasPartnerAndIsConnecting } = useAppContext()

  const remoteTrackPublished = (publication) => {
    const onPreEvent = window.location.pathname.indexOf('/pre-event') > -1

    if (publication.isSubscribed) {
      const remoteDiv = document.getElementById('remote-video')
      if (remoteDiv) {
        const attachedTrack = publication.track.attach()
        if (publication.kind === 'video') {
          attachedTrack.muted = true
        }
        remoteDiv.appendChild(attachedTrack)
        setHasPartnerAndIsConnecting(false)
        intentionalPause(hasPartnerAndIsConnectingBreathingRoom)
      }
    }
    publication.on('subscribed', (track) => {
      console.log('onSubscribed')
      const attachedTrack = track.attach()
      if (publication.kind === 'video') {
        attachedTrack.muted = true
      }
      if (onPreEvent) {
        document.getElementById('host-video').appendChild(attachedTrack)
      } else {
        document.getElementById('remote-video').appendChild(attachedTrack)
      }
      setHasPartnerAndIsConnecting(false)
      intentionalPause(hasPartnerAndIsConnectingBreathingRoom)
      // setDidPartnerDisconnect(false)
    })

    publication.on('unsubscribed', (track) => {})
  }
  return { remoteTrackPublished }
}

export default useRemoteTrackPublished
