import React, { useState } from 'react'
import * as Yup from 'yup'
import { Button, Grid } from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { useSubscriptionSignupStyles } from '.'
import { Snack } from '../../common'
import { signup } from '../../helpers'
import { constants } from '../../utils'
import { useHistory } from 'react-router-dom'

const { ROLE, TOKEN, USER_ID } = constants
const validEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
// 1 digit, 1 lowecase, 1 uppercase, at least 8 chars long, allows for special chars
const passwordRegex = /^(?=.*\d)(?=.*[a-z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,}$/

const SignupSchema = Yup.object().shape({
  first_name: Yup.string().min(1, 'Too Short!').required('Required'),
  last_name: Yup.string().min(1, 'Too Short!').required('Required'),
  email: Yup.string().matches(validEmailRegex).required('Required'),
  password: Yup.string()
    .matches(
      passwordRegex,
      'must be at least 8 chars long and contain 1 digit, 1 lowercase, and 1 uppercase'
    )
    .required('Required'),
})

const NewSignupForm: React.FC<{}> = () => {
  const history = useHistory()

  const classes = useSubscriptionSignupStyles()
  const [errorSnackMessage, setErrorSnackMessage] = useState<string>('')
  return (
    <>
      <Formik
        validationSchema={SignupSchema}
        initialValues={{
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          confirm_password: '',
        }}
        onSubmit={async (values, actions) => {
          const { confirm_password, email, first_name, last_name, password } = values
          actions.setSubmitting(true)
          if (confirm_password !== password) {
            actions.setSubmitting(false)
            return setErrorSnackMessage('Passwords do not match')
          }
          try {
            const signupResponse = await signup({ email, first_name, last_name, password })
            if (signupResponse.error) {
              actions.setSubmitting(false)
              return setErrorSnackMessage(signupResponse.error)
            }
            const { token, id, role } = signupResponse
            localStorage.setItem(ROLE, role)
            localStorage.setItem(TOKEN, token)
            localStorage.setItem(USER_ID, id)
            window.analytics.identify(id, {
              name: `${first_name} ${last_name}`,
              first_name,
              email,
              role,
              created_at: signupResponse.created_at,
            })
            window.analytics.track('Sign up')
          } catch (err) {
            console.log(err)
          }
          actions.setSubmitting(false)
          // check to see if you have plan_type_billingPeriod in LS
          // if so, push to checkout
          if (localStorage.getItem('PLAN_TYPE')) {
            history.push('/checkout')
            // test to see if we need to keep reloading here
            return window.location.reload()
          }
          history.push('/onboarding')
          window.location.reload()
        }}
      >
        {({ submitForm, isSubmitting }) => (
          <Form className={classes.formContainer}>
            <Grid container direction="column" justify="flex-start" alignItems="flex-start">
              <Grid container direction="row">
                <Grid item xs={12} md={6} className={classes.inputSpacing}>
                  <Field
                    component={TextField}
                    name="first_name"
                    label="First Name"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6} className={classes.inputSpacing}>
                  <Field
                    component={TextField}
                    name="last_name"
                    label="Last Name"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid container className={classes.inputSpacing}>
                  <Field component={TextField} name="email" label="Email" fullWidth required />
                </Grid>
                <Grid item xs={12} md={6} className={classes.inputSpacing}>
                  <Field
                    component={TextField}
                    type="password"
                    name="password"
                    label="Password"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6} className={classes.inputSpacing}>
                  <Field
                    component={TextField}
                    type="password"
                    name="confirm_password"
                    label="Confirm Password"
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container justify="center" alignItems="center">
              <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
              >
                Submit
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
      <Snack
        open={Boolean(errorSnackMessage)}
        onClose={() => setErrorSnackMessage('')}
        severity="error"
        duration={4000}
        snackMessage={errorSnackMessage}
      />
    </>
  )
}

export default NewSignupForm
