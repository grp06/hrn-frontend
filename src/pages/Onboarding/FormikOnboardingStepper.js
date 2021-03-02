import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import { Grid, Button, CircularProgress, Stepper, Step, StepLabel } from '@material-ui/core'
import { useOnboardingStyles } from '.'

const FormikOnboardingStepper = ({ children, ...props }) => {
  const classes = useOnboardingStyles()
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
      if (values.interests.length >= 3) setDisabledButton(false)
      else {
        setDisabledButton(true)
      }
    }
    if (step === 2) {
      setDisabledButton(false)
    }
  }

  const toggleHostDisableButton = (values) => {
    if (step === 0) {
      if (values.community_type) setDisabledButton(false)
    }
    if (step === 1) {
      if (values.currently_organize) setDisabledButton(false)
      else setDisabledButton(true)
    }
    if (step === 2) {
      if (values.event_frequency) setDisabledButton(false)
      else setDisabledButton(true)
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
          onChange={
            props.isHostOnboarding ? toggleHostDisableButton(values) : toggleDisableButton(values)
          }
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
                  variant="outlined"
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
