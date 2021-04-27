import React, { useState } from 'react'
import * as Yup from 'yup'
import { Button, Grid, Typography } from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { useSubscriptionSignupStyles } from '.'
import { FloatCardMedium, Snack } from '../../common'
import { signup } from '../../helpers'
import { constants } from '../../utils'
import { Link, useHistory } from 'react-router-dom'

const { ROLE, TOKEN, USER_ID } = constants
// 1 digit, 1 lowecase, 1 uppercase, at least 8 chars long, allows for special chars
const passwordRegex = /^(?=.*\d)(?=.*[a-z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,}$/

const SignupSchema = Yup.object().shape({
  first_name: Yup.string().min(1, 'Too Short!').required('Required'),
  last_name: Yup.string().min(1, 'Too Short!').required('Required'),
  email: Yup.string().email('Please enter email').required('Required'),
  password: Yup.string()
    .matches(
      passwordRegex,
      'Must be at least 8 chars long and contain 1 digit, 1 lowercase, and 1 uppercase'
    )
    .required('Required'),
  confirm_password: Yup.string()
    .min(1, 'Too Short!')
    .required('Required')
    .oneOf([Yup.ref('password')], 'Confirm Password does not match'),
})

const NewSignupForm: React.FC<{}> = () => {
  const history = useHistory()

  const classes = useSubscriptionSignupStyles()
  const [errorSnackMessage, setErrorSnackMessage] = useState<string>('')
  const [showSignupSuccessSnack, setShowSignupSuccessSnack] = useState(false)

  return (
    <Grid container justify="center" alignItems="center" className={classes.wrapper}>
      <FloatCardMedium>
        <Grid item container direction="column" sm={9} xs={12} className={classes.formContainer}>
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
              const { email, first_name, last_name, password } = values
              actions.setSubmitting(true)
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
                  email,
                  role,
                })
                window.analytics.track('Sign up')
                setShowSignupSuccessSnack(true)
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
              <Form>
                <Grid item container direction="column" alignItems="center">
                  <Grid item>
                    <Typography variant="h2" className={classes.formHeader}>
                      Glad to have you join us!{' '}
                      <span role="img" aria-label="hands up">
                        🙌
                      </span>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="column"
                  justify="flex-start"
                  alignItems="flex-start"
                  className={classes.inputContainer}
                >
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
                <Grid container direction="column" justify="center" alignItems="center">
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    onClick={submitForm}
                  >
                    Submit
                  </Button>
                  <Link className={classes.linkRedirectToLogin} to="/">
                    Already have an account?
                  </Link>
                  <Typography variant="subtitle2" className={classes.privacyPolicyText}>
                    By creating an account on our app you acknoweldge that you have read and accept
                    our{' '}
                    <Link
                      to="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.privacyPolicyLink}
                    >
                      privacy policy
                    </Link>
                  </Typography>
                  <Snack
                    open={showSignupSuccessSnack}
                    onClose={() => setShowSignupSuccessSnack(false)}
                    severity="success"
                    snackMessage="Unlocking the doors 🚪"
                  />
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
        </Grid>
      </FloatCardMedium>
    </Grid>
  )
}

export default NewSignupForm
