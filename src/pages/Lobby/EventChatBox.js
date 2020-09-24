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
    borderRadius: '4px',
    border: '2px solid #3e4042',
    boxShadow: '5px 5px 0 #3e4042',
    backgroundColor: theme.palette.common.greyCard,
  },
  lobbyAttendeesContainer: {
    width: '100%',
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
  toggleButtonGroup: {
    width: '100%',
  },
  toggleButtonInactive: {
    padding: theme.spacing(1, 0),
    textAlign: 'center',
    backgroundColor: 'transparent',
    width: '50%',
    border: 'none',
    borderRadius: 0,
    color: theme.palette.common.ghostWhite,
    borderBottom: '2px solid #3e4042',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  toggleButtonActive: {
    '&.Mui-selected': {
      padding: theme.spacing(1, 0),
      textAlign: 'center',
      width: '50%',
      border: 'none',
      borderRadius: 0,
      backgroundColor: 'transparent',
      color: theme.palette.common.sunray,
      borderBottom: '2px solid #fabb5b',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  },
}))

const EventChatBox = React.memo(({ event }) => {
  const classes = useStyles()
  const onlineEventAttendees = useGetOnlineEventAttendees(event)
  const [chatBoxStatus, setChatBoxStatus] = useState('onlineUsers')
  console.log('chatBoxStastus ->', chatBoxStatus)

  const handleChatboxStatusToggle = (e) => {
    console.log('value', e.currentTarget.value)
    setChatBoxStatus(e.currentTarget.value)
  }

  const renderEventChatBoxContent = () => {
    return chatBoxStatus === 'chat' ? (
      <Typography variant="h6" style={{ textAlign: 'center' }}>
        Chat Coming Soon!{' '}
        <span role="img" aria-label="sunGlassSmileingFace">
          😎
        </span>
      </Typography>
    ) : (
      <Typography variant="h6" style={{ textAlign: 'center' }}>
        OnlineUsers
      </Typography>
    )
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
          value={chatBoxStatus}
          exclusive
          onChange={handleChatboxStatusToggle}
          aria-label="chatBox Status"
          className={classes.toggleButtonGroup}
        >
          <ToggleButton
            value="chat"
            aria-label="chat"
            disableRipple
            className={
              chatBoxStatus === 'chat' ? classes.toggleButtonActive : classes.toggleButtonInactive
            }
          >
            Chat
          </ToggleButton>
          <ToggleButton
            value="onlineUsers"
            aria-label="online users"
            disableRipple
            className={
              chatBoxStatus === 'onlineUsers'
                ? classes.toggleButtonActive
                : classes.toggleButtonInactive
            }
          >
            Online Users
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.chatBox}
      >
        {renderEventChatBoxContent()}
      </Grid>
    </Grid>
  )
})

export default EventChatBox
