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

export const disableParticipantsAudioTrack = (participant) => {
  const { audioTracks: participantsAudioTracks, identity: participantsId } = participant
  if (participantsAudioTracks.size) {
    participantsAudioTracks.forEach((publication) => {
      publication.track.disable()
      toggleParticipantsMicIcon(participantsId, 'inline')
    })
  }
}

export const publishParticipantsAudioAndVideo = (participant) => {
  const {
    audioTracks: participantsAudioTracks,
    identity: participantsId,
    videoTracks: participantsVideoTracks,
  } = participant
  const localStoragePreferredVideoId = localStorage.getItem('preferredVideoId') || undefined
  const localStoragePreferredAudioId = localStorage.getItem('preferredAudioId') || undefined
  if (!participantsVideoTracks.size && !participantsAudioTracks.size) {
    Video.createLocalTracks({
      audio: { deviceId: localStoragePreferredAudioId },
      video: { deviceId: localStoragePreferredVideoId },
    }).then((localTracks) => {
      localTracks.forEach((track) => {
        participant.publishTrack(track)
        if (track.kind === 'video') {
          const attachedVideoTrack = track.attach()
          appendVideoToParticipantsDivElement(attachedVideoTrack, participantsId)
        }
      })
    })
  }
}

export const toggleParticipantsMicIcon = (participantId, style) => {
  const participantsMicOffIconDiv = document.getElementById(`${participantId}-mic-off-icon-div`)
  if (participantsMicOffIconDiv) {
    participantsMicOffIconDiv.style.display = style
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
    if (publication.kind === 'audio') {
      toggleParticipantsMicIcon(participantsId, 'none')
    }
  })
}
