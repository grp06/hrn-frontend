import { useEffect, useState } from 'react'
import { useRoom } from '.'
import { participantConnected } from '../helpers'
import { useGameContext } from '../context/useGameContext'

const useTwilio = () => {
  const { room, twilioReady, setTwilioReady } = useGameContext()

  useEffect(() => {
    if (room && !twilioReady) {
      console.log('inside room')
      const { localParticipant } = room
      localParticipant.tracks.forEach((publication) => {
        const localDiv = document.getElementById('local-video')
        if (localDiv && !localDiv.children.length) {
          const attachedTrack = publication.track.attach()
          localDiv.appendChild(attachedTrack)
        }
      })

      room.participants.forEach(participantConnected)
      room.on('participantConnected', participantConnected)

      room.on('participantDisconnected', (remoteParticipant) => {
        console.log('remote participant disconnected')

        const remoteVideo = document.getElementById('remote-video')
        if (remoteVideo) {
          remoteVideo.innerHTML = ''
        }
      })

      window.addEventListener('beforeunload', () => {
        room.disconnect()
      })

      room.on('disconnected', function (rum, error) {
        console.log('disconnected')
        rum.localParticipant.tracks.forEach(function (track) {
          track.unpublish()
        })

        const remoteVideo = document.getElementById('remote-video')
        if (remoteVideo) {
          remoteVideo.innerHTML = ''
        }
      })
      setTwilioReady(true)
    }
  }, [room])

  return { twilioReady }
}

export default useTwilio
