import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import PersonIcon from '@material-ui/icons/Person'
import { makeStyles } from '@material-ui/styles'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { useGetOnlineEventAttendees } from '../../hooks'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '80%',
    padding: theme.spacing(1),
    borderRadius: '4px',
    border: '2px solid #3e4042',
    boxShadow: '5px 5px 0 #3e4042',
    backgroundColor: theme.palette.common.greyCard,
  },
  lobbyAttendeesContainer: {
    height: '10%',
    margin: theme.spacing(0, 'auto'),
  },
  onlineAttendeesText: {
    color: theme.palette.common.sunray,
    marginLeft: theme.spacing(0.5),
  },
  totalAttendeesContainer: {
    width: 'auto',
    marginLeft: theme.spacing(1),
  },
  chatBox: {
    height: '88%',
  },
  toggleButtonInactive: {
    color: theme.palette.common.ghostWhite,
  },
  toggleButtonActive: {
    color: theme.palette.common.dankPurp,
  },
}))

const EventChatBox = React.memo(({ event }) => {
  const classes = useStyles()
  const onlineEventAttendees = useGetOnlineEventAttendees(event)
  const [chatboxStatus, setChatboxStatus] = useState('onlineUsers')

  const handleChatboxStatusToggle = (e) => {
    console.log('value', e.currentTarget.value)
    setChatboxStatus(e.currentTarget.value)
  }
  return (
    <Grid container direction="column" justify="space-around" className={classes.container}>
      <Grid
        container
        wrap="nowrap"
        alignItems="center"
        justify="center"
        className={classes.lobbyAttendeesContainer}
      >
        <ToggleButtonGroup
          value={chatboxStatus}
          exclusive
          onChange={handleChatboxStatusToggle}
          aria-label="chatBox Status"
        >
          <ToggleButton
            value="chat"
            aria-label="chat"
            className={
              chatboxStatus === 'chat' ? classes.toggleButtonActive : classes.toggleButtonInactive
            }
          >
            Chat
          </ToggleButton>
          <ToggleButton
            value="onlineUsers"
            aria-label="online users"
            className={
              chatboxStatus === 'onlineUsers'
                ? classes.toggleButtonActive
                : classes.toggleButtonInactive
            }
          >
            Online Users
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Divider />
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.chatBox}
      >
        <Typography variant="h6" style={{ textAlign: 'center' }}>
          Chat Coming Soon!{' '}
          <span role="img" aria-label="sunGlassSmileingFace">
            😎
          </span>
        </Typography>
      </Grid>
    </Grid>
  )
})

export default EventChatBox
