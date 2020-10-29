import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'
import PeopleIcon from '@material-ui/icons/People'
import VideocamIcon from '@material-ui/icons/Videocam'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import { makeStyles } from '@material-ui/styles'

import { SetupMicAndCameraButton } from '../Event'
import { endEvent } from '../../helpers'

const useStyles = makeStyles((theme) => ({
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
  filledIconButton: {
    backgroundColor: theme.palette.common.basePurple,
    '&:hover': {
      backgroundColor: 'rgb(98, 60, 153)',
    },
    margin: theme.spacing(0, 1),
  },
  settingsAndChatGrid: {
    paddingRight: '6vw',
  },
}))

const GroupVideoChatBottomPanel = React.memo(
  ({ event, setUserHasEnabledCameraAndMic, twilioGroupChatRoom, userId }) => {
    const classes = useStyles()
    const { start_at: eventStartTime, id: event_id, host_id, status: eventStatus } = event
    const userIsHost = host_id === userId
    const [participantsVideoTracks, setParticipantsVideoTracks] = useState([])

    const handleEndEvent = () => {
      endEvent(event_id)
    }

    const handleVideoToggle = () => {
      const { localParticipant } = twilioGroupChatRoom
      const { videoTracks } = twilioGroupChatRoom.localParticipant
      const localParticipantsVideoDiv = document.getElementById(localParticipant.identity)

      // unpublish if we have video tracks
      if (videoTracks.size) {
        videoTracks.forEach((localTrackPublication) => {
          setParticipantsVideoTracks(localTrackPublication.track)
          // remove video from other peoples screens
          localTrackPublication.unpublish()
          // remove video from your screen
          const mediaElements = localTrackPublication.track.detach()
          mediaElements.forEach((mediaElement) => mediaElement.remove())
        })
      } else {
        // publish our video track and add it to our screen
        twilioGroupChatRoom.localParticipant.publishTrack(participantsVideoTracks)
        const attachedTrack = participantsVideoTracks.attach()
        attachedTrack.style.transform = 'scale(-1, 1)'
        localParticipantsVideoDiv.appendChild(attachedTrack)
      }
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
              <Button variant="outlined" color="primary" onClick={handleEndEvent}>
                End Event
              </Button>
            ) : (
              <Button variant="contained" color="primary">
                Leave Event
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid container justify="center" alignItems="center">
          <IconButton
            disabled={!twilioGroupChatRoom}
            disableRipple
            className={classes.filledIconButton}
            onClick={handleVideoToggle}
          >
            <VideocamIcon style={{ color: 'ghostWhite', fontSize: '2rem' }} />
          </IconButton>
          <IconButton disableRipple color="primary" className={classes.filledIconButton}>
            <MicIcon style={{ color: 'ghostWhite', fontSize: '2rem' }} />
          </IconButton>
        </Grid>
        <Grid
          container
          justify="flex-end"
          alignItems="center"
          className={classes.settingsAndChatGrid}
        >
          <SetupMicAndCameraButton setUserHasEnabledCameraAndMic={setUserHasEnabledCameraAndMic} />
          <IconButton disableRipple>
            <PeopleIcon style={{ color: 'ghostWhite', fontSize: '2rem' }} />
          </IconButton>
        </Grid>
      </Grid>
    )
  }
)

export default GroupVideoChatBottomPanel
