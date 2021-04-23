import React, { useCallback, useState } from 'react'
import { Grid, Badge, IconButton } from '@material-ui/core'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble'
import { Mic, MicOff } from '@material-ui/icons'

import { MoreActionsButton, useVideoRoomStyles } from '.'

const InVideoBottomControlPanel = React.memo(
  ({ chatIsOpen, myRound, room, numberOfUnreadMessagesFromMyPartner, toggleChat }) => {
    const classes = useVideoRoomStyles()
    const [isMuted, setIsMuted] = useState(false)

    const toggleMute = useCallback(() => {
      if (room?.localParticipant.audioTracks) {
        const { audioTracks } = room.localParticipant
        audioTracks.forEach((audioTrack) => {
          if (isMuted) {
            audioTrack.track.enable()
            setIsMuted(false)
          } else {
            audioTrack.track.disable()
            setIsMuted(true)
          }
        })
      }
    }, [room, isMuted])

    return (
      <Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="center"
        wrap="nowrap"
        className={classes.inVideoBottomControlPanelContainer}
      >
        <Grid item>
          <IconButton
            disableRipple
            className={
              chatIsOpen ? ` ${classes.activeButton} ${classes.iconButton}` : classes.iconButton
            }
            onClick={toggleMute}
          >
            {isMuted ? (
              <MicOff titleAccess="Unmute" style={{ color: 'ghostWhite', fontSize: '2rem' }} />
            ) : (
              <Mic titleAccess="Mute" style={{ color: 'ghostWhite', fontSize: '2rem' }} />
            )}
          </IconButton>

          <IconButton
            disableRipple
            className={
              chatIsOpen ? ` ${classes.activeButton} ${classes.iconButton}` : classes.iconButton
            }
          >
            <Badge
              badgeContent={chatIsOpen ? 0 : numberOfUnreadMessagesFromMyPartner}
              color="secondary"
            >
              <ChatBubbleIcon
                style={{ color: 'ghostWhite', fontSize: '2rem' }}
                onClick={toggleChat}
              />
            </Badge>
          </IconButton>
        </Grid>
        {/* <Grid item>
        <IconButton disableRipple className={classes.iconButton}>
          <NoteIcon style={{ color: 'ghostWhite', fontSize: '2rem' }} />
        </IconButton>
      </Grid> */}
        <Grid item>
          <MoreActionsButton myRound={myRound} />
        </Grid>
      </Grid>
    )
  }
)

export default InVideoBottomControlPanel
