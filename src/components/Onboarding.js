import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import { FloatCardMedium, FormikStepper } from '../common'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-material-ui'
const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '150px',
  },
}))

const Onboarding = () => {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <FloatCardMedium>
        <FormikStepper
          initialValues={{
            firstName: '',
            lastName: '',
            userBio: '',
            jobTitle: '',
            location: '',
          }}
          onSubmit={() => {}}
        >
          <div>
            <Box paddingBottom={2}>
              <Field name="firstName" component={TextField} label="First Name" fullWidth />
            </Box>
            <Box paddingBottom={2}>
              <Field name="lastName" component={TextField} label="Last Name" fullWidth />
            </Box>
          </div>
          <div>
            <Box paddingBottom={2}>
              <Field name="userBio" component={TextField} label="User Bio" fullWidth />
            </Box>
            <Box paddingBottom={2}>
              <Field name="jobTitle" component={TextField} label="Job Title" fullWidth />
            </Box>
          </div>
          <div>
            <Box paddingBottom={2}>
              <Field name="location" component={TextField} label="Location" fullWidth />
            </Box>
          </div>
        </FormikStepper>
      </FloatCardMedium>
    </div>
  )
}

export default Onboarding
