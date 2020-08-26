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
  endMessage: {
    textAlign: 'center',
    width: '75%',
    margin: theme.spacing(0, 'auto'),
    marginBottom: theme.spacing(3),
  },
  whatToExpect: {
    color: theme.palette.common.ghostWhite,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginLeft: theme.spacing(3),
  },
  eventFormatStepper: {
    paddingTop: 0,
  },
}))

function getSteps(eventRoundLength) {
  return ['Welcome remarks from the host', '1 on 1 conversations', 'Share contact details (or not)']
}

function getStepContent(step, eventRoundLength) {
  switch (step) {
    case 0:
      return `Before the event starts, the event host will share a few words with you via a live stream to get you hyped for the event!`
    case 1:
      return `Once the event starts, you'll be put into a private video chat with another event attendee. Throughout the event, you'll have a series of ${eventRoundLength} minute conversations with someone new every round.`
    case 2:
      return `After each round, you can choose to share contact details with the person you just chatted with. If it's mutual, you'll receive each other's contact info at the end of the event. `
    default:
      return 'Unknown step'
  }
}

const EventBreakdownStepper = ({ eventRoundLength }) => {
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
      <Grid container alignItems="center" className={classes.whatToExpect}>
        <Typography variant="h5">What to expect</Typography>
      </Grid>
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        className={classes.eventFormatStepper}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography variant="body1">{getStepContent(index, eventRoundLength)}</Typography>
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
          <Typography variant="h6" className={classes.endMessage}>
            You&apos;re all set! If you have already RSVPed, sit tight and wait for the event to
            start. If you have not RSVPed, scroll up and click the Sign Up / RSVP button!
          </Typography>
          <Button onClick={handleReset} variant="contained" color="primary">
            Reset Steps
          </Button>
        </Grid>
      )}
    </div>
  )
}

export default EventBreakdownStepper
