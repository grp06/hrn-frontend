import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'

const useStyles = makeStyles((theme) => ({
  formContainer: {
    padding: theme.spacing(3),
  },
  backResetButton: {
    backgroundColor: theme.palette.common.greyButton,
    color: theme.palette.common.ghostWhite,
    marginRight: theme.spacing(1),
  },
}))

const FormikOnboardingStepper = ({ children, ...props }) => {
  const classes = useStyles()
  const stepArray = React.Children.toArray(children)
  const [step, setStep] = useState(0)
  const currentStep = stepArray[step]
  const [completed, setCompleted] = useState(false)
  const [disabledButton, setDisabledButton] = useState(true)

  function isLastStep() {
    return step === stepArray.length - 1
  }

  const toggleDisableButton = (values) => {
    if (step === 0) {
      if (values.city) setDisabledButton(false)
    }
    if (step === 1) {
      if (values.short_bio.length < 100) setDisabledButton(true)
      else {
        setDisabledButton(false)
      }
    }
    if (step === 2) {
      if (values.interests.length >= 1) setDisabledButton(false)
      else {
        setDisabledButton(true)
      }
    }
  }

  return (
    <Formik
      {...props}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers)
          setCompleted(true)
        } else {
          setStep((currentChild) => currentChild + 1)
        }
      }}
    >
      {({ isSubmitting, values }) => (
        <Form
          autoComplete="off"
          className={classes.formContainer}
          onChange={toggleDisableButton(values)}
        >
          <Stepper alternativeLabel activeStep={step}>
            {stepArray.map((child, index) => (
              <Step key={child.props.label} completed={step > index || completed}>
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {currentStep}
          <Grid container spacing={2} justify="center" alignItems="center">
            {step > 0 ? (
              <Grid item>
                <Button
                  disabled={isSubmitting}
                  variant="contained"
                  color="primary"
                  onClick={() => setStep((s) => s - 1)}
                >
                  Back
                </Button>
              </Grid>
            ) : null}
            <Grid item>
              <Button
                startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                disabled={isSubmitting || disabledButton}
                variant="contained"
                color="primary"
                type="submit"
              >
                {isSubmitting ? 'Submitting' : isLastStep() ? 'Submit' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  )
}

export default FormikOnboardingStepper
