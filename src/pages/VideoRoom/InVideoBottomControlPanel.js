import React from 'react'
import { Grid, Badge, IconButton } from '@material-ui/core'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble'

import { MoreActionsButton, useVideoRoomStyles } from '.'

const InVideoBottomControlPanel = React.memo(
  ({ chatIsOpen, myRound, numberOfUnreadMessagesFromMyPartner, toggleChat }) => {
    const classes = useVideoRoomStyles()
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
