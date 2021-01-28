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
import { Link } from 'react-router-dom'
import confettiDoodles from '../../assets/confettiDoodles.svg'
import { Snack, FloatCardMedium } from '../../common'

import { phoneOrUsernameLogin } from '../../helpers'
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
    padding: theme.spacing(5),
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
  sectionContainer: {
    margin: theme.spacing(4, 0),
  },
  linkRedirectToLogin: {
    color: theme.palette.common.ghostWhite,
    fontFamily: 'Muli',
    textDecoration: 'none',
    marginTop: theme.spacing(2.5),
    '&:hover': {
      color: theme.palette.common.basePink,
    },
  },
}))

const RSVPSchema = Yup.object().shape({
  username: Yup.string().min(4, 'Too Short!'),
  phone_number: Yup.string().min(7, 'Too Short!'),
  password: Yup.string().min(8, 'Too Short!').required('Required'),
})

const FanLoginForm = ({ chitChat }) => {
  const classes = useStyles()
  const [RSVPFormErrorMessage, setRSVPFormErrorMessage] = useState('')
  const [formSubmitting, setFormSubmitting] = useState(false)

  return (
    <Grid container justidy="center" alignItems="center" className={classes.wrapper}>
      <FloatCardMedium>
        <Grid item container direction="column" md={9} xs={12} className={classes.formContainer}>
          <Formik
            initialValues={{
              phone_number: '',
              username: '',
              password: '',
            }}
            onSubmit={async (values, { setSubmitting }) => {
              setFormSubmitting(true)
              const { phone_number, username, password } = values

              if (!phone_number && !username) {
                setRSVPFormErrorMessage('You must login with a phone number or a username')
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
                loginResponse = await phoneOrUsernameLogin({ username, password, phone_number })
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
              window.analytics.identify(id, {
                username,
                phone_number,
                role,
              })
              window.analytics.track('Fan sign in')
              localStorage.setItem(USER_ID, id)
              localStorage.setItem(ROLE, role)
              localStorage.setItem(TOKEN, token)

              setFormSubmitting(false)
              // I'm confused by this transition modal stuff so I'm just reloading for now - George
              window.location.reload()
            }}
            validationSchema={RSVPSchema}
          >
            {({ dirty, isValid, submitForm }) => (
              <Form className={classes.formContainer}>
                <Grid
                  container
                  direction="column"
                  justify="center"
                  alignItems="center"
                  className={classes.sectionContainer}
                >
                  <Grid container direction="row">
                    <Grid item xs={12} className={classes.formInputMargin}>
                      <Field
                        component={TextField}
                        name="username"
                        label="Username"
                        type="text"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formInputMargin}>
                      <Field name="phone_number" label="Your phone number" required>
                        {({ form }) => (
                          <PhoneInput
                            inputProps={{ name: 'phone_number', required: true, autoFocus: true }}
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
                        name="password"
                        label="Password"
                        type="password"
                        required
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
                    Sign in
                  </Button>
                </Grid>
              </Form>
            )}
          </Formik>
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

export default FanLoginForm
