import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import { makeStyles } from '@material-ui/styles'
import copy from 'copy-to-clipboard'
import formatDate from '../utils/formatDate'
import { TransitionModal, EventCard } from '.'

const useStyles = makeStyles((theme) => ({
  eventPromptHeader: {
    ...theme.typography.h2,
    textAlign: 'center',
    color: theme.palette.common.ghostWhite,
  },
  divider: {
    width: '25%',
    marginTop: '10px',
    marginBottom: '20px',
  },
  eventPromptBody: {
    marginBottom: '20px',
  },
}))

const ShareEventPromptModal = ({ event }) => {
  const classes = useStyles()
  const { start_at, id } = event
  const eventStartTime = formatDate(start_at)

  const [showSnackbar, setShowSnackbar] = useState(false)

  const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />

  const handleSnackbarClose = (pressEvent, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setShowSnackbar(false)
  }

  const renderModalButton = TransitionModal({
    modalBody: (
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <Typography className={classes.eventPromptHeader}>
            We've curated a message for you to easily share your event with your friends and
            community!
          </Typography>
        </Grid>
        <Divider variant="middle" className={classes.divider} />
        <Grid container item direction="column">
          <div className={classes.eventPromptBody} id="eventPrompt">
            <Typography>Hi 👋, </Typography>
            <Typography>
              I'm hosting a speed-networking event with Hi Right Now and wanted to get you involved!
              Heres the flow of the event:
            </Typography>
            <List dense>
              <ListItem key={1}>
                <Typography>
                  1. You will get paired with one other event participant randomly.
                </Typography>
              </ListItem>
              <ListItem key={2}>
                <Typography>2. You two will video-chat for 5 minutes.</Typography>
              </ListItem>
              <ListItem key={3}>
                <Typography>
                  3. Decide if you want to exchange contact details with your partner.
                </Typography>
              </ListItem>
              <ListItem key={4}>
                <Typography>4. Rinse and repeat for an hour!</Typography>
              </ListItem>
            </List>
            <Typography>
              The time of the event and the sign up link are below. Just make sure to come back to
              that page 5 minutes before the event so you can get settled in before the event. Can't
              wait to see your smiling face soon 😁
            </Typography>
            <br />
            <Typography>Sign Up: https://launch.hirightnow.co/events/{id}</Typography>
            <Typography>Event Time: {eventStartTime}</Typography>
          </div>
        </Grid>
      </Grid>
    ),
    button: {
      buttonText: '🌏 Invite Friends',
      buttonColor: 'secondary',
      buttonSize: 'large',
    },
    onAcceptFunction: () => {
      const copyPrompt = document.getElementById('eventPrompt').innerText
      copy(copyPrompt)
      setShowSnackbar(true)
    },
    onAcceptButtonText: 'Copy this prompt!',
  })

  return (
    <div>
      {renderModalButton}
      <Snackbar open={showSnackbar} autoHideDuration={1800} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="info">
          Copied 💾
        </Alert>
      </Snackbar>
    </div>
  )
}

export default ShareEventPromptModal
