import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/styles'
import copy from 'copy-to-clipboard'
import formatDate from '../../utils/formatDate'
import { TransitionModal, Snack } from '../../common'

const useStyles = makeStyles((theme) => ({
  eventPromptHeader: {
    textAlign: 'center',
  },
  divider: {
    width: '25%',
    marginTop: '10px',
    marginBottom: '20px',
  },
  eventPromptBody: {
    marginBottom: '20px',
  },
  eventPromptParagraph: {
    marginBottom: theme.spacing(1.5),
  },
}))

const ShareEventPromptModal = ({ event, renderHostMessage }) => {
  const classes = useStyles()
  const { start_at, id } = event
  const eventStartTime = formatDate(start_at)

  const [showSnack, setShowSnack] = useState(false)

  const eventPromptBody = renderHostMessage ? (
    <div>
      <Typography variant="body1">
        Hi{' '}
        <span role="img" aria-label="hand wave">
          👋
        </span>
        ,{' '}
      </Typography>
      <Typography variant="body1">
        I'm hosting a speed-networking event with Hi Right Now and wanted to get you involved! Heres
        the flow of the event:
      </Typography>
      <List dense>
        <ListItem key={1}>
          <Typography variant="body1">
            1. You will get paired with one other event participant randomly.
          </Typography>
        </ListItem>
        <ListItem key={2}>
          <Typography variant="body1">2. You two will video-chat for 5 minutes.</Typography>
        </ListItem>
        <ListItem key={3}>
          <Typography variant="body1">
            3. Decide if you want to exchange contact details with your partner.
          </Typography>
        </ListItem>
        <ListItem key={4}>
          <Typography variant="body1">4. Rinse and repeat for an hour!</Typography>
        </ListItem>
      </List>
      <Typography variant="body1">
        The time of the event and the sign up link are below. Just make sure to come back to that
        page 5 minutes before the event so you can get settled in before the event. Can&apos;t wait
        to see your smiling face soon{' '}
        <span role="img" aria-label="cheesy smiley">
          😁
        </span>
      </Typography>
      <br />
      <Typography variant="body1">
        Sign Up: https://launch.hirightnow.co/events/
        {id}
      </Typography>
      <Typography variant="body1">
        Event Time:
        {eventStartTime}
      </Typography>
    </div>
  ) : (
    <div>
      <Typography variant="body1" className={classes.eventPromptParagraph}>
        Whats up!
      </Typography>
      <Typography variant="body1" className={classes.eventPromptParagraph}>
        I found this cool platform that connects us with people that are relevant based on our
        interests. We just video chat with someone 1:1 for a few minutes, decide if we want to
        connect later, and rinse and repeat for about an hour!
      </Typography>
      <Typography variant="body1" className={classes.eventPromptParagraph}>
        I think you&apos;ll like it and want you to try it out with me. Some people have said they
        landed job interviews here and have met some awesome people to collab with{' '}
        <span role="img" aria-label="totally dude">
          🤙
        </span>
        . Follow the link below{' '}
      </Typography>
      <Typography variant="body1">
        Sign Up: https://launch.hirightnow.co/events/
        {id}
      </Typography>
      <Typography variant="body1">Event Time: {eventStartTime}</Typography>
    </div>
  )

  const renderModalButton = TransitionModal({
    modalBody: (
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <Typography variant="h2" className={classes.eventPromptHeader}>
            We&apos;ve curated a message for you to easily share the event!
          </Typography>
        </Grid>
        <Divider variant="middle" className={classes.divider} />
        <Grid container item direction="column" md={9}>
          <div className={classes.eventPromptBody} id="eventPrompt">
            {eventPromptBody}
          </div>
        </Grid>
      </Grid>
    ),
    button: {
      buttonText: 'Invite Friends 🌏',
      buttonColor: 'secondary',
      buttonSize: 'large',
    },
    onAcceptFunction: () => {
      const copyPrompt = document.getElementById('eventPrompt').innerText
      window.analytics.track('Copied share event prompt')
      copy(copyPrompt)
      setShowSnack(true)
    },
    onAcceptButtonText: 'Copy this prompt!',
  })

  return (
    <div>
      {renderModalButton}
      <Snack
        open={showSnack}
        duration={1800}
        onClose={() => setShowSnack(false)}
        severity="info"
        snackMessage={
          <div>
            Copied{' '}
            <span role="img" aria-label="floppy disk">
              💾
            </span>
          </div>
        }
      />
    </div>
  )
}

export default ShareEventPromptModal
