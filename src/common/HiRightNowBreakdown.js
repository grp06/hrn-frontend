import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  backResetButton: {
    backgroundColor: theme.palette.common.greyButton,
    color: theme.palette.common.ghostWhite,
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    paddingBottom: theme.spacing(3),
    width: '100%',
    textAlign: 'center',
  },
  stepLabel: {
    color: theme.palette.common.ghostWhite,
  },
  endMessage: {
    textAlign: 'center',
    width: '75%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing(3),
  },
}))

function getSteps(eventRoundLength) {
  return [
    'Join an event',
    'Host delivers speech',
    'Give video permissions',
    `${eventRoundLength} minute mingles`,
    'Connect with new friends',
  ]
}

function getStepContent(step, eventRoundLength) {
  switch (step) {
    case 0:
      return `Well, you're already here so all you have to do is click 'RSVP for Event'. This will put your name into our matching algorithm.`
    case 1:
      return 'Before you start chatting with everyone, your host will share a few words with you through a live stream to get you hyped for the event!'
    case 2:
      return 'We all want to see your beautiful face, so do not be camera shy! We will ask for your video permissions right after the pre-event speech so watch out for the notification in your browser.'
    case 3:
      return `Once the event starts, you will be put into a private videochat with one other event attendee. You two will have ${eventRoundLength} minutes to chat about whatever you like. After ${eventRoundLength} minutes, you will be paired with someone else after a short stretching intermission.`
    case 4:
      return `After each round you elect to share your email with the person you just chatted with. If theres a mutual interest, you each will get the others contact information at the end of the event.`
    default:
      return 'Unknown step'
  }
}

const HiRightNowBreakdown = ({ eventRoundLength }) => {
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(0)
  const steps = getSteps(eventRoundLength)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel className={classes.stepLabel}>{label}</StepLabel>
            <StepContent>
              <Typography>{getStepContent(index, eventRoundLength)}</Typography>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.backResetButton}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? `Okay, got it!` : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Grid conatiner className={classes.resetContainer} justify="center" alignItems="center">
          <Typography className={classes.endMessage}>
            You're all set! If you have already RSVPed, sit tight and wait for the event to start.
            If you have not RSVPed, scroll up and click the Sign Up / RSVP button!
          </Typography>
          <Button onClick={handleReset} variant="contained" color="primary">
            Reset Steps
          </Button>
        </Grid>
      )}
    </div>
  )
}

export default HiRightNowBreakdown
