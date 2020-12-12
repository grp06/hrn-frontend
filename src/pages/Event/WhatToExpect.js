import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import MobileStepper from '@material-ui/core/MobileStepper'
import Typography from '@material-ui/core/Typography'
import { makeStyles, useTheme } from '@material-ui/core/styles'

const hostSteps = [
  {
    title: 'Starting the Event',
    text:
      "When it's time for the event to start, come back to the event page and you will see the event controls on the bottom of your screen ",
  },
  {
    title: 'Giving Welcoming Remarks',
    text:
      'Prior to the speed-networking portion of the event, you will share a few words with your attendees via a live stream to get them hyped for the event!',
  },
  {
    title: '1 on 1 Conversations',
    text:
      'Our algorithm will match your attendees to their most relevant matches. Sit back and watch your community engage with one another or join the fun by participating in the event (default) ',
  },
  {
    title: 'Post Event Debrief',
    text:
      'When the event is over you can start a group video chat for everyone to mingle together as a group!',
  },
]

const attendeeSteps = [
  {
    title: 'Attending the event',
    text:
      'Come back to this page a few minutes before the event is slated to start. You will see a countdown clock and the event will go live shortly after the clock expires.',
  },
  {
    title: 'Welcome Remarks from the Host',
    text:
      'Before the event starts, the event host will share a few words with you via a live stream to get you hyped for the event!',
  },
  {
    title: '1 on 1 Conversations',
    text:
      "Once the event starts, you'll be put into a private video chat with another event attendee. Throughout the event, you'll have a series of several minute conversations with someone new every round.",
  },
  {
    title: 'Share contact details (or not)',
    text:
      "If you're vibing with your partner, you can share your contact details with them at any point during or directly after the chat. Don't worry, your information won't be handed unless you elect to.",
  },
  {
    title: 'Help us help you',
    text:
      'After each chat we ask how excited you would be to match with your partner again. We use this information to help better understand your preferences in people and curate better matches for you in the future.',
  },
  {
    title: 'Post Event Mingle',
    text:
      'Join all the other event attendees in a group video chat after the event to debrief and hang out.',
  },
]

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: 'auto',
    padding: theme.spacing(3, 5),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3, 3),
    },
  },
  stepBodyText: {
    width: '90%',
  },
  stepperBody: {
    height: '130px',
    width: '90%',
    [theme.breakpoints.down('md')]: {
      height: 'auto',
    },
    margin: theme.spacing(2, 'auto', 0, 'auto'),
  },
  stepperBar: {
    width: '50%',
    margin: theme.spacing(0, 'auto'),
  },
}))

function WhatToExpect({ userIsHost }) {
  const classes = useStyles()
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const maxSteps = userIsHost ? hostSteps.length : attendeeSteps.length

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  return (
    <Grid container direction="column" justify="flex-start" className={classes.cardContainer}>
      <Typography variant="h3">
        {userIsHost ? 'What to expect as a host' : 'What to expect from the event'}
      </Typography>
      <div>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
          className={classes.stepperBody}
        >
          <Typography variant="h6">
            {userIsHost ? hostSteps[activeStep].title : attendeeSteps[activeStep].title}
          </Typography>
          <Typography variant="body1" className={classes.stepBodyText}>
            {userIsHost ? hostSteps[activeStep].text : attendeeSteps[activeStep].text}
          </Typography>
        </Grid>
        <MobileStepper
          variant="dots"
          steps={maxSteps}
          position="static"
          className={classes.stepperBar}
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
              disableRipple
            >
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0} disableRipple>
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </Button>
          }
        />
      </div>
    </Grid>
  )
}

export default WhatToExpect
