const setupHostPreEvent = (room, setCameraAndMicPermissions) => {
  setCameraAndMicPermissions({
    hasWebcam: true,
    hasMicrophone: true,
    isMicrophoneAlreadyCaptured: true,
    isWebcamAlreadyCaptured: true,
  })
  const { localParticipant } = room
  localParticipant.tracks.forEach((publication) => {
    console.log('local tracks looping')

    const hostVideoDiv = document.getElementById('host-video')
    if (hostVideoDiv && !hostVideoDiv.children.length && publication.track.kind === 'video') {
      const attachedTrack = publication.track.attach()
      attachedTrack.style.transform = 'scale(-1, 1)'
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
