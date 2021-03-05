const setupHostPreEvent = (room) => {
  const { localParticipant } = room
  localParticipant.tracks.forEach((publication) => {
    const hostVideoDiv = document.getElementById('host-video')
    if (hostVideoDiv && !hostVideoDiv.children.length && publication.track.kind === 'video') {
      const attachedTrack = publication.track.attach()
      hostVideoDiv.appendChild(attachedTrack)
    }
  })
  room.on('disconnected', function (rum) {
    rum.localParticipant.tracks.forEach(function (track) {
      track.unpublish()
    })

    const hostVideo = document.getElementById('host-video')
    if (hostVideo) {
      hostVideo.innerHTML = ''
    }
  })
}

export default setupHostPreEvent
