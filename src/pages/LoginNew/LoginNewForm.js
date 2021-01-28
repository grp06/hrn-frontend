import React, { useState } from 'react'
import * as Yup from 'yup'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { makeStyles } from '@material-ui/styles'
import { useHistory, Link } from 'react-router-dom'
import confettiDoodles from '../../assets/confettiDoodles.svg'
import { Snack, FloatCardMedium } from '../../common'

import { loginNew } from '../../helpers'
import { constants } from '../../utils'

const { USER_ID, TOKEN, ROLE } = constants

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${confettiDoodles})`,
  },
  formContainer: {
    margin: theme.spacing(0, 'auto'),
    padding: theme.spacing(2, 5),
  },
  inputContainer: {
    margin: theme.spacing(4, 0),
  },
  formInputMargin: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(0, 1),
  },
  phoneInputClass: {
    width: '100%',
    background: 'blue',
  },
  pinkText: {
    color: theme.palette.common.basePink,
  },
  phoneNumberLabel: {
    fontSize: 12,
    paddingBottom: theme.spacing(1),
  },
  linkRedirectToSignUp: {
    color: theme.palette.common.ghostWhite,
    fontFamily: 'Muli',
    textDecoration: 'none',
    marginTop: theme.spacing(2.5),
    '&:hover': {
      color: theme.palette.common.basePink,
    },
  },
  privacyPolicyText: {
    marginTop: theme.spacing(3),
    textAlign: 'center',
  },
  privacyPolicyLink: {
    textDecoration: 'none',
    color: theme.palette.common.sunray,
  },
}))

const RSVPSchema = Yup.object().shape({
  usernameOrEmail: Yup.string().min(4, 'Too Short!'),
  phone_number: Yup.string().min(7, 'Too Short!'),
  password: Yup.string().min(8, 'Too Short!').required('Required'),
})

const LoginNewForm = () => {
  const classes = useStyles()
  const [RSVPFormErrorMessage, setRSVPFormErrorMessage] = useState('')
  const [formSubmitting, setFormSubmitting] = useState(false)
  const history = useHistory()

  return (
    <Grid container justify="center" alignItems="center" className={classes.wrapper}>
      <FloatCardMedium noMarginBottom>
        <Grid item container direction="column" md={9} xs={12} className={classes.formContainer}>
          <Grid item container direction="column" alignItems="center">
            <Grid item>
              <Typography variant="h2" className={classes.formHeader}>
                Welcome{' '}
                <span role="img" aria-label="hand wave">
                  👋
                </span>
              </Typography>
            </Grid>
          </Grid>
          <Grid item container direction="column" className={classes.inputContainer}>
            <Formik
              initialValues={{
                phone_number: '',
                usernameOrEmail: '',
                password: '',
              }}
              onSubmit={async (values, { setSubmitting }) => {
                setFormSubmitting(true)
                const { phone_number, usernameOrEmail, password } = values
                console.log('🚀 ~ onSubmit={ ~ password', password)
                console.log('🚀 ~ onSubmit={ ~ usernameOrEmail', usernameOrEmail)
                console.log('🚀 ~ onSubmit={ ~ phone_number', phone_number)

                if (!phone_number && !usernameOrEmail) {
                  setRSVPFormErrorMessage('You forgot a phone number, email, or username')
                  setFormSubmitting(false)
                  return
                }

                if (!password) {
                  setRSVPFormErrorMessage('Please enter a password')
                  setFormSubmitting(false)
                  return
                }
                let loginResponse
                try {
                  loginResponse = await loginNew({
                    usernameOrEmail,
                    password,
                    phone_number: `+${phone_number}`,
                  })
                  const { id, token, role } = loginResponse

                  if (loginResponse.error) {
                    setRSVPFormErrorMessage(loginResponse.error)
                    throw loginResponse.error
                  }
                } catch (err) {
                  console.log('err === ', err)
                  setRSVPFormErrorMessage(err)
                  setFormSubmitting(false)
                  return
                }

                const { token, id, role } = loginResponse
                console.log('🚀 ~ onSubmit={ ~ role', role)
                console.log('🚀 ~ onSubmit={ ~ id', id)
                console.log('🚀 ~ onSubmit={ ~ token', token)
                window.analytics.identify(id, {
                  usernameOrEmail,
                  phone_number,
                  role,
                })
                window.analytics.track(`${role} sign in`)
                localStorage.setItem(USER_ID, id)
                localStorage.setItem(ROLE, role)
                localStorage.setItem(TOKEN, token)

                setFormSubmitting(false)

                if (role === 'fan') {
                  history.push('/fan-home')
                } else {
                  history.push('/creator-home')
                }

                window.location.reload()
              }}
              validationSchema={RSVPSchema}
            >
              {({ dirty, isValid, submitForm }) => (
                <Form>
                  <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    className={classes.sectionContainer}
                  >
                    <Grid container direction="row">
                      <Grid item xs={12} className={classes.formInputMargin}>
                        <Typography variant="subtitle2" className={classes.phoneNumberLabel}>
                          Phone number
                        </Typography>
                        <Field name="phone_number" label="Your phone number">
                          {({ form }) => (
                            <PhoneInput
                              inputProps={{ name: 'phone_number', autoFocus: true }}
                              inputStyle={{
                                width: '100%',
                                background: '#262626',
                                color: '#E2E8F2',
                                border: 'none',
                                borderBottom: '2px solid #3e4042',
                              }}
                              buttonStyle={{
                                background: '#262626',
                                border: '1px solid #3e4042',
                              }}
                              dropdownStyle={{
                                width: '200px',
                                background: '#262626',
                                color: '#E2E8F2',
                              }}
                              country="us"
                              value={form.values.phone_number}
                              onChange={(phoneNumber) => {
                                form.setFieldValue('phone_number', phoneNumber)
                              }}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item xs={12} className={classes.formInputMargin}>
                        <Field
                          component={TextField}
                          name="usernameOrEmail"
                          label="Username or Email"
                          type="text"
                          // shouldnt have to do this but I don't know whats restricting the width
                          style={{ width: '100%' }}
                        />
                      </Grid>

                      <Grid item xs={12} className={classes.formInputMargin}>
                        <Field
                          component={TextField}
                          name="password"
                          label="Password"
                          type="password"
                          required
                          // shouldnt have to do this but I don't know whats restricting the width
                          style={{ width: '100%' }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container justify="center" alignItems="center">
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={formSubmitting ? <CircularProgress size="1rem" /> : null}
                      disabled={formSubmitting || !isValid || !dirty}
                      onClick={submitForm}
                    >
                      Log in
                    </Button>
                    <Link className={classes.linkRedirectToSignUp} to="/forgot-password">
                      Forgot Password?
                    </Link>
                    <Typography variant="subtitle2" className={classes.privacyPolicyText}>
                      By logging into our app you acknoweldge that you have read and accept our{' '}
                      <Link
                        to="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={classes.privacyPolicyLink}
                      >
                        privacy policy
                      </Link>
                    </Typography>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Grid>
          <Snack
            open={Boolean(RSVPFormErrorMessage)}
            onClose={() => setRSVPFormErrorMessage('')}
            severity="error"
            duration={3000}
            snackMessage={RSVPFormErrorMessage}
          />
        </Grid>
      </FloatCardMedium>
    </Grid>
  )
}

export default LoginNewForm
