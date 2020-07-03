import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  backResetButton: {
    backgroundColor: theme.palette.common.greyButton,
    color: theme.palette.common.ghostWhite,
    marginRight: theme.spacing(1),
  },
}))

const FormikStepper = ({ children, ...props }) => {
  const classes = useStyles()
  const childrenArray = React.Children.toArray(children)
  const [step, setStep] = useState(0)
  const currentChild = childrenArray[step]

  const isLastStep = step === childrenArray.length - 1
  console.log(isLastStep)

  return (
    <Formik
      {...props}
      onSubmit={async (values, helpers) => {
        if (isLastStep) {
          await props.onSubmit(values, helpers)
        } else {
          setStep((currentStep) => currentStep + 1)
        }
      }}
    >
      <Form autoComplete="off">
        {currentChild}
        {step > 0 && (
          <Button
            className={classes.backResetButton}
            variant="contained"
            onClick={() => setStep((currentStep) => currentStep - 1)}
          >
            Back
          </Button>
        )}
        <Button color="primary" variant="contained" type="submit">
          {isLastStep ? 'Submit' : 'Next'}
        </Button>
      </Form>
    </Formik>
  )
}

export default FormikStepper
