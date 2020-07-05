import { useAppContext } from '../context/useAppContext'
import { sleep } from '../helpers'
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
        sleep(hasPartnerAndIsConnectingBreathingRoom)
      }
    }
    publication.on('subscribed', async (track) => {
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
      await sleep(hasPartnerAndIsConnectingBreathingRoom)
      // setDidPartnerDisconnect(false)
    })

    publication.on('unsubscribed', (track) => {})
  }
  return { remoteTrackPublished }
}

export default useRemoteTrackPublished
