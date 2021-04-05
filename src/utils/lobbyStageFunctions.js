import Video from 'twilio-video'

export const unpublishParticipantsTracks = (participant) => {
  const { identity: participantsId, tracks: participantsTracks } = participant
  participantsTracks.forEach((publication) => {
    publication.unpublish()
    const participantsDiv = document.getElementById(participantsId)
    const participantsVideoElement = document.getElementById(`${participantsId}-video`)
    if (publication.kind === 'video' && participantsVideoElement && participantsDiv) {
      participantsVideoElement.remove()
      participantsDiv.style.display = 'none'
    }
  })
}

export const publishParticipantsAudioAndVideo = (participant) => {
  const { identity: participantsId, videoTracks: participantsVideoTracks } = participant
  const localStoragePreferredVideoId = localStorage.getItem('preferredVideoId') || undefined
  const participantsVideoDiv = document.getElementById(participantsId)
  if (!participantsVideoTracks.size && participantsVideoDiv) {
    Video.createLocalVideoTrack({
      deviceId: { exact: localStoragePreferredVideoId },
    }).then((localVideoTrack) => {
      participant.publishTrack(localVideoTrack)
      const attachedTrack = localVideoTrack.attach()
      participantsVideoDiv.style.display = 'inline-flex'
      attachedTrack.style.transform = 'scale(-1, 1)'
      attachedTrack.setAttribute('id', `${participantsId}-video`)
      participantsVideoDiv.appendChild(attachedTrack)
    })
  }
}
