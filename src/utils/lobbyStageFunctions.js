import Video from 'twilio-video'

export const appendVideoToParticipantsDivElement = (attachedVideoTrack, participantId) => {
  const participantsVideoDiv = document.getElementById(participantId)
  if (participantsVideoDiv) {
    participantsVideoDiv.style.display = 'inline-flex'
    attachedVideoTrack.style.transform = 'scale(-1, 1)'
    attachedVideoTrack.setAttribute('id', `${participantId}-video`)
    participantsVideoDiv.appendChild(attachedVideoTrack)
  }
}

export const publishParticipantsAudioAndVideo = (participant) => {
  const { identity: participantsId, videoTracks: participantsVideoTracks } = participant
  const localStoragePreferredVideoId = localStorage.getItem('preferredVideoId') || undefined
  if (!participantsVideoTracks.size) {
    Video.createLocalVideoTrack({
      deviceId: { exact: localStoragePreferredVideoId },
    }).then((localVideoTrack) => {
      participant.publishTrack(localVideoTrack)
      const attachedVideoTrack = localVideoTrack.attach()
      appendVideoToParticipantsDivElement(attachedVideoTrack, participantsId)
    })
  }
}

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
