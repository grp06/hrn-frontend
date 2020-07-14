import { useState } from 'react'

import { useParticipantConnected } from '.'
import { useAppContext } from '../context/useAppContext'
import { constants } from '../utils'
import { sleep } from '../helpers'

const useTwilio = () => {
  const {
    setPartnerDisconnected,
    setPartnerNeverConnected,
    setHasPartnerAndIsConnecting,
  } = useAppContext()
  const { partnerCameraIssueTimeout } = constants
  const [twilioStarted, setTwilioStarted] = useState(null)

  const { participantConnected } = useParticipantConnected()

  const startTwilio = (room) => {
    setTwilioStarted(true)
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

      room.participants.forEach(participantConnected)

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
        if (remoteVideo) {
          remoteVideo.innerHTML = ''
        }
      })

      window.addEventListener('beforeunload', () => {
        room.disconnect()
      })

      room.on('disconnected', function (rum) {
        setTwilioStarted(false)
        setPartnerNeverConnected(false)
        setPartnerDisconnected(false)
        setHasPartnerAndIsConnecting(false)

        rum.localParticipant.tracks.forEach(function (track) {
          track.unpublish()
        })

        const remoteVideo = document.getElementById('remote-video')
        if (remoteVideo) {
          remoteVideo.innerHTML = ''
        }
      })
    }
  }

  return { startTwilio, twilioStarted }
}

export default useTwilio
