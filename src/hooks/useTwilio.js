import { useEffect, useState } from 'react'
import { useRoom } from '.'
import { participantConnected } from '../helpers'

const useTwilio = () => {
  const { room } = useRoom()
  const [twilioReady, setTwilioReady] = useState(false)

  useEffect(() => {
    if (room) {
      const { localParticipant } = room
      localParticipant.tracks.forEach((publication) => {
        const localDiv = document.getElementById('local-video')
        if (localDiv) {
          const attachedTrack = publication.track.attach()
          localDiv.appendChild(attachedTrack)
        }
      })

      room.participants.forEach(participantConnected)
      room.on('participantConnected', participantConnected)

      room.on('participantDisconnected', (remoteParticipant) => {
        const remoteVideo = document.getElementById('remote-video')
        if (remoteVideo) {
          remoteVideo.innerHTML = ''
        }
      })

      window.addEventListener('beforeunload', () => {
        room.disconnect()
      })

      room.on('disconnected', function (rum, error) {
        rum.localParticipant.tracks.forEach(function (track) {
          track.unpublish()
        })

        const localVideo = document.getElementById('local-video')
        const remoteVideo = document.getElementById('remote-video')
        remoteVideo.innerHTML = ''
        localVideo.innerHTML = ''
      })
      setTwilioReady(true)
    }
  }, [room])

  return { twilioReady }
}

export default useTwilio
