import React from 'react'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble'
import NoteIcon from '@material-ui/icons/Note'
import { makeStyles } from '@material-ui/styles'

import { MoreActionsButton } from '.'
import { constants } from '../../utils'

const { bottomNavBarHeight } = constants

const useStyles = makeStyles((theme) => ({
  activeButton: {
    borderRadius: '4px',
    backgroundColor: '#41444A !important',
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
  iconButton: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    '&:hover': {
      borderRadius: '4px',
      backgroundColor: '#41444A',
    },
  },
  container: {
    position: 'fixed',
    zIndex: 3,
    width: '100%',
    height: bottomNavBarHeight,
    top: 'auto',
    bottom: '0%',
    padding: theme.spacing(2, 4),
    paddingRight: '6vw',
    backgroundColor: theme.palette.common.grey10,
  },
}))

const InVideoBottomControlPanel = React.memo(({ chatIsOpen, myRound, toggleChat }) => {
  const classes = useStyles()
  return (
    <Grid
      container
      direction="row"
      justify="flex-end"
      alignItems="center"
      wrap="nowrap"
      className={classes.container}
    >
      <Grid item>
        <IconButton
          disableRipple
          className={
            chatIsOpen ? ` ${classes.activeButton} ${classes.iconButton}` : classes.iconButton
          }
        >
          <ChatBubbleIcon style={{ color: 'ghostWhite', fontSize: '2rem' }} onClick={toggleChat} />
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
})

export default InVideoBottomControlPanel
