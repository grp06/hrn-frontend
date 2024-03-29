import { useTwilioContext } from '../context'
import { constants } from '../utils'

const { hasPartnerAndIsConnectingBreathingRoom } = constants

const useRemoteTrackPublished = () => {
  const { setHasPartnerAndIsConnecting } = useTwilioContext()

  const remoteTrackPublished = (publication) => {
    const onPreEvent = window.location.pathname.indexOf('/lobby') > -1

    if (publication.isSubscribed) {
      const remoteDiv = document.getElementById('remote-video')
      if (publication.kind === 'video' && remoteDiv) {
        const attachedTrack = publication.track.attach()
        attachedTrack.muted = true

        remoteDiv.appendChild(attachedTrack)

        setTimeout(() => {
          setHasPartnerAndIsConnecting(false)
        }, hasPartnerAndIsConnectingBreathingRoom)
      }
    }

    publication.on('subscribed', async (track) => {
      const attachedTrack = track.attach()
      if (publication.kind === 'video') {
        attachedTrack.muted = true
        if (onPreEvent) {
          document.getElementById('host-video').appendChild(attachedTrack)
        } else {
          console.log('subscribed, attaching track')
          document.getElementById('remote-video').appendChild(attachedTrack)
        }
      }

      setTimeout(() => {
        setHasPartnerAndIsConnecting(false)
      }, hasPartnerAndIsConnectingBreathingRoom)
    })

    publication.on('unsubscribed', (track) => {})
  }
  return { remoteTrackPublished }
}

export default useRemoteTrackPublished
