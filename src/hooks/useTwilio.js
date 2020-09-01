import { useParticipantConnected } from '.'
import { useAppContext } from '../context/useAppContext'
import { constants } from '../utils'

const useTwilio = () => {
  const {
    setPartnerDisconnected,
    setPartnerNeverConnected,
    setHasPartnerAndIsConnecting,
  } = useAppContext()
  // 45 seconds is way too long
  const { partnerCameraIssueTimeout } = constants

  const { participantConnected } = useParticipantConnected()

  const startTwilio = (room) => {
    setPartnerNeverConnected(false)
    // check to see if your partner joins within 30 seconds. If not, we assume
    // that they are having trouble connecting (camera permission issues)
    setTimeout(() => {
      if (!room.participants.size) {
        setPartnerNeverConnected(true)
      }
    }, partnerCameraIssueTimeout)

    if (room) {
      const { localParticipant } = room

      localParticipant.tracks.forEach((publication) => {
        const localDiv = document.getElementById('local-video')
        if (localDiv && !localDiv.children.length && publication.track.kind === 'video') {
          const attachedTrack = publication.track.attach()
          attachedTrack.style.transform = 'scale(-1, 1)'
          localDiv.appendChild(attachedTrack)
        }
      })

      // when we connect to a room, run 'participantConnected'
      // for each person who is already in the room when we arrive
      room.participants.forEach(participantConnected)

      // set up a listener to do some stuff when new people join the room
      room.on('participantConnected', (remoteParticipant) => {
        console.log('participantConnected', remoteParticipant)
        setPartnerNeverConnected(false)
        setPartnerDisconnected(false)
        participantConnected(remoteParticipant)
      })

      room.on('participantDisconnected', (remoteParticipant) => {
        console.log('participantDisconnected', remoteParticipant)

        setPartnerDisconnected(true)
        const remoteVideo = document.getElementById('remote-video')
        // instead of modifying the innerHTML, detatch instead
        if (remoteVideo) {
          remoteVideo.innerHTML = ''
        }
      })

      window.addEventListener('beforeunload', () => {
        room.disconnect()
      })

      room.on('reconnecting', (error) => {
        if (error.code === 53001) {
          window.analytics.track('Twilio error 53001')
          console.log('Reconnecting your signaling connection!', error.message)
        } else if (error.code === 53405) {
          window.analytics.track('Twilio error 53405')
          console.log('Reconnecting your media connection!', error.message)
        }
      })

      // local participant reconnects to the room
      // room.on('reconnected', () => {
      //   console.log('Reconnected!');
      // });

      // local participant disconnects
      room.on('disconnected', (rum, error) => {
        setPartnerNeverConnected(false)
        setPartnerDisconnected(false)
        setHasPartnerAndIsConnecting(false)
        if (error) {
          console.log('Unexpectedly disconnected:', error)
        }
        const localDiv = document.getElementById('local-video')
        if (localDiv) {
          localDiv.innerHTML = ''
        }
        const remoteVideo = document.getElementById('remote-video')
        if (remoteVideo) {
          remoteVideo.innerHTML = ''
        }
      })
    }
  }

  return { startTwilio }
}

export default useTwilio
