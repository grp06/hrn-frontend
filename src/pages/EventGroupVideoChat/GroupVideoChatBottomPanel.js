import React, { useEffect, useState } from 'react'
import Badge from '@material-ui/core/Badge'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble'
import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'
import VideocamIcon from '@material-ui/icons/Videocam'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import { makeStyles } from '@material-ui/styles'
import Video from 'twilio-video'

import { EndEventButton, LeaveEventButton } from '.'
import { SetupMicAndCameraButton } from '../Event'

const useStyles = makeStyles((theme) => ({
  activeButton: {
    borderRadius: '4px',
    backgroundColor: '#41444A !important',
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
  container: {
    position: 'fixed',
    zIndex: 999,
    width: '100%',
    height: '80px',
    top: 'auto',
    bottom: '0%',
    padding: theme.spacing(2, 4),
    backgroundColor: theme.palette.common.grey10,
  },
  greySquareIconButton: {
    borderRadius: '4px',
    backgroundColor: 'transparent',
    '&:hover': {
      borderRadius: '4px',
      backgroundColor: '#41444A',
    },
    margin: theme.spacing(0, 1),
  },
  settingsAndChatGrid: {
    paddingRight: '6vw',
  },
}))

const GroupVideoChatBottomPanel = React.memo(
  ({
    chatIsOpen,
    event_id,
    numberOfUnreadChatMessages,
    setUserHasEnabledCameraAndMic,
    toggleChat,
    twilioGroupChatRoom,
    userIsHost,
  }) => {
    const classes = useStyles()
    const [participantHasEnabledAudio, setParticipantHasEnabledAudio] = useState(false)
    const [participantHasEnabledVideo, setParticipantHasEnabledVideo] = useState(false)
    const [participantsVideoTracks, setParticipantsVideoTracks] = useState([])
    const [participantsVideoIsOn, setParticipantsVideoIsOn] = useState(false)
    const [participantsAudioIsOn, setParticipantsAudioIsOn] = useState(false)

    useEffect(() => {
      setParticipantHasEnabledVideo(true)
      setParticipantsVideoIsOn(true)
    }, [])

    useEffect(() => {
      if (userIsHost) {
        setParticipantHasEnabledAudio(true)
        setParticipantsAudioIsOn(true)
      }
    }, [userIsHost])

    const handleEnableVideo = () => {
      const { localParticipant } = twilioGroupChatRoom
      const localStoragePreferredVideoId = localStorage.getItem('preferredVideoId')
      const localParticipantsVideoDiv = document.getElementById(localParticipant.identity)

      Video.createLocalVideoTrack({
        deviceId: { exact: localStoragePreferredVideoId },
      }).then((localVideoTrack) => {
        localParticipant.publishTrack(localVideoTrack)
        const attachedTrack = localVideoTrack.attach()
        attachedTrack.style.transform = 'scale(-1, 1)'
        attachedTrack.setAttribute('id', `${localParticipant.identity}-video`)
        localParticipantsVideoDiv.appendChild(attachedTrack)
        setParticipantHasEnabledVideo(true)
        setParticipantsVideoIsOn(true)
      })
    }

    const handleEnableAudio = () => {
      const { localParticipant } = twilioGroupChatRoom
      const { identity } = localParticipant
      const localStoragePreferredAudioId = localStorage.getItem('preferredAudioId')

      Video.createLocalAudioTrack({
        deviceId: { exact: localStoragePreferredAudioId },
      }).then((localAudioTrack) => {
        localParticipant.publishTrack(localAudioTrack)
        setParticipantHasEnabledAudio(true)
        setParticipantsAudioIsOn(true)
        const usersMicOffIconDiv = document.getElementById(`${identity}-mic-off-icon-div`)
        usersMicOffIconDiv.style.display = 'none'
      })
    }

    const handleVideoToggle = () => {
      const { localParticipant } = twilioGroupChatRoom
      const { videoTracks } = twilioGroupChatRoom.localParticipant
      const localParticipantsVideoDiv = document.getElementById(localParticipant.identity)

      // unpublish if we have video tracks
      if (videoTracks.size) {
        videoTracks.forEach((localTrackPublication) => {
          // we want to save our video tracks because they will go away
          // after unpublishing
          setParticipantsVideoTracks(localTrackPublication.track)
          // remove video from other peoples screens
          localTrackPublication.unpublish()
          // remove video from your screen
          const mediaElements = localTrackPublication.track.detach()
          mediaElements.forEach((mediaElement) => mediaElement.remove())
          setParticipantsVideoIsOn(false)
        })
      } else {
        // publish our video track and add it to our screen
        // the video div should only have one child at this point (the name card)
        // if it has more than there is already a video being attached, so lets return
        // so we dont keep attaching multiple videos
        if (localParticipantsVideoDiv.children.length > 1) {
          return
        }
        twilioGroupChatRoom.localParticipant.publishTrack(participantsVideoTracks)
        const attachedTrack = participantsVideoTracks.attach()
        attachedTrack.style.transform = 'scale(-1, 1)'
        localParticipantsVideoDiv.appendChild(attachedTrack)
        setParticipantsVideoIsOn(true)
      }
    }

    const handleAudioToggle = () => {
      const { audioTracks, identity } = twilioGroupChatRoom.localParticipant
      console.log('identity ->', identity)
      const usersMicOffIconDiv = document.getElementById(`${identity}-mic-off-icon-div`)
      console.log('usersMicOffIconDiv ->', usersMicOffIconDiv)
      audioTracks.forEach((localTrackPublication) => {
        const { isEnabled } = localTrackPublication.track
        localTrackPublication.track.enable(!isEnabled)
        setParticipantsAudioIsOn(!isEnabled)
        if (isEnabled) {
          usersMicOffIconDiv.style.display = 'inline'
        } else {
          usersMicOffIconDiv.style.display = 'none'
        }
      })
    }

    return (
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
        wrap="nowrap"
        className={classes.container}
      >
        <Grid container direction="column">
          <Grid container direction="row" alignItems="flex-end">
            {userIsHost ? (
              <EndEventButton event_id={event_id} />
            ) : (
              <LeaveEventButton event_id={event_id} />
            )}
          </Grid>
        </Grid>
        <Grid container justify="center" alignItems="center">
          <IconButton
            disabled={!twilioGroupChatRoom}
            disableRipple
            className={classes.greySquareIconButton}
            onClick={participantHasEnabledVideo ? handleVideoToggle : handleEnableVideo}
          >
            {participantHasEnabledVideo && participantsVideoIsOn ? (
              <VideocamIcon style={{ color: '#f4f6fa', fontSize: '2rem' }} />
            ) : (
              <VideocamOffIcon style={{ color: '#ff3333', fontSize: '2rem' }} />
            )}
          </IconButton>
          <IconButton
            disabled={!twilioGroupChatRoom}
            disableRipple
            color="primary"
            className={classes.greySquareIconButton}
            onClick={participantHasEnabledAudio ? handleAudioToggle : handleEnableAudio}
          >
            {participantHasEnabledAudio && participantsAudioIsOn ? (
              <MicIcon style={{ color: '#f4f6fa', fontSize: '2rem' }} />
            ) : (
              <MicOffIcon style={{ color: '#ff3333', fontSize: '2rem' }} />
            )}
          </IconButton>
        </Grid>
        <Grid
          container
          justify="flex-end"
          alignItems="center"
          className={classes.settingsAndChatGrid}
        >
          <Grid item>
            <IconButton
              disableRipple
              className={
                chatIsOpen ? ` ${classes.activeButton} ${classes.iconButton}` : classes.iconButton
              }
            >
              <Badge badgeContent={chatIsOpen ? 0 : numberOfUnreadChatMessages} color="secondary">
                <ChatBubbleIcon
                  style={{ color: 'ghostWhite', fontSize: '2rem' }}
                  onClick={toggleChat}
                />
              </Badge>
            </IconButton>
          </Grid>
          <SetupMicAndCameraButton setUserHasEnabledCameraAndMic={setUserHasEnabledCameraAndMic} />
        </Grid>
      </Grid>
    )
  }
)

export default GroupVideoChatBottomPanel
