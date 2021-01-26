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
    title: 'Share your event link on social media',
    text: 'After you create your event, share the event link where you can reach your fans.',
  },
  {
    title: 'Chat with your fans',
    text: 'Effortlessly connect with your fans over a series of 1:1 video chats.',
  },
  {
    title: 'Get paid',
    text: 'Get rewarded for your time connecting with your fans.',
  },
]

const attendeeSteps = [
  {
    title: 'Sign up with your phone number',
    text: 'Input your phone number to RSVP for the event.',
  },
  {
    title: 'Get an SMS reminder',
    text: `10 minutes before your turn, you'll get an SMS reminder. Click on it to show up.`,
  },
  {
    title: 'Reward the creator',
    text: 'Make sure to thank the creator via Venmo or Cash App.',
  },
]

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: 'auto',
    marginTop: theme.spacing(1.5),
    padding: theme.spacing(3, 5),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
    },
  },
  stepBodyText: {
    marginTop: theme.spacing(1),
    lineHeight: 1.25,
    width: '90%',
  },
  stepperBody: {
    height: '130px',
    width: '90%',
    [theme.breakpoints.down('md')]: {
      height: 'auto',
    },
    margin: theme.spacing(0, 'auto'),
  },
  stepperBar: {
    width: '50%',
    margin: theme.spacing(0, 'auto'),
  },
}))

function WhatToExpectChitChat({ userIsHost }) {
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
      <div>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
          className={classes.stepperBody}
        >
          <Typography variant="h4">
            {userIsHost ? hostSteps[activeStep].title : attendeeSteps[activeStep].title}
          </Typography>
          <Typography variant="subtitle1" className={classes.stepBodyText}>
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

export default WhatToExpectChitChat
