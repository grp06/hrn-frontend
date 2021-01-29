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

import { Snack } from '../../common'
import { signupUserNew } from '../../helpers'
import { constants } from '../../utils'

const { USER_ID, TOKEN, ROLE } = constants

const useStyles = makeStyles((theme) => ({
  formContainer: {
    width: '85%',
    height: 'auto',
    maxWidth: '1560px',
    margin: theme.spacing(0, 'auto', 0, 'auto'),
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
    textAlign: 'left',
  },
  orLabel: {
    paddingLeft: theme.spacing(2),
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
  phoneNumber: Yup.string().min(10, 'Too Short!').required('Required'),
  username: Yup.string().min(4, 'Too Short!').required('Required'),
  password: Yup.string().min(8, 'Too Short!').required('Required'),
  passwordRepeated: Yup.string().min(8, 'Too Short!').required('Required'),
})

const RSVPForChitChatForm = ({ chitChat }) => {
  const classes = useStyles()
  const [RSVPFormErrorMessage, setRSVPFormErrorMessage] = useState('')
  const [formSubmitting, setFormSubmitting] = useState(false)
  const { host } = chitChat
  const { name: hostName } = host

  return (
    <div>
      <Formik
        initialValues={{
          phoneNumber: '',
          username: '',
          password: '',
          passwordRepeated: '',
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setFormSubmitting(true)
          const { phoneNumber, username, password, passwordRepeated } = values

          if (password !== passwordRepeated) {
            setRSVPFormErrorMessage('Passwords must match')
            setFormSubmitting(false)
            return
          }
          let signupResponse
          try {
            signupResponse = await signupUserNew({
              role: 'fan',
              userInfo: { username, password, phoneNumber: `+${phoneNumber}` },
              chitChat,
            })

            if (signupResponse.error) {
              setRSVPFormErrorMessage(signupResponse.error)
              throw signupResponse.error
            }
          } catch (err) {
            console.log('err === ', err)
            setRSVPFormErrorMessage(err)
            setFormSubmitting(false)
            return
          }

          const { token, id, role } = signupResponse
          window.analytics.identify(id, {
            username,
            phoneNumber,
            role,
          })
          window.analytics.track('Sign up fan new')
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
            <Grid container direction="column" justify="center" alignItems="center">
              <Typography variant="h3">
                Signup to meet {hostName}{' '}
                <span role="img" aria-label="hooray smiley">
                  🥳
                </span>
              </Typography>
              <Grid container direction="row">
                <Grid item xs={12} className={classes.formInputMargin}>
                  <Field
                    component={TextField}
                    name="username"
                    label="Username"
                    type="text"
                    required
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
                    style={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={12} className={classes.formInputMargin}>
                  <Field
                    component={TextField}
                    name="passwordRepeated"
                    label="Repeat Password"
                    type="password"
                    required
                    style={{ width: '100%' }}
                  />
                </Grid>

                <Grid item xs={12} className={classes.formInputMargin}>
                  <Field name="phoneNumber" label="Your phone number" required>
                    {({ form }) => (
                      <PhoneInput
                        inputProps={{ name: 'phoneNumber', required: true, autoFocus: true }}
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
                        value={form.values.phoneNumber}
                        onChange={(phoneNumber) => {
                          form.setFieldValue('phoneNumber', phoneNumber)
                        }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12} className={classes.formInputMargin}>
                  <Field component={TextField} name="username" label="Username" type="text" />
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
                <Grid item xs={12} className={classes.formInputMargin}>
                  <Field
                    component={TextField}
                    name="passwordRepeated"
                    label="Repeat Password"
                    type="password"
                    required
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container direction="column" justify="center" alignItems="center">
              <Button
                variant="contained"
                color="primary"
                startIcon={formSubmitting ? <CircularProgress size="1rem" /> : null}
                disabled={formSubmitting || !isValid || !dirty}
                onClick={submitForm}
              >
                Sign me up!
              </Button>
              <Link className={classes.linkRedirectToLogin} to="/login-new">
                Already have an account?
              </Link>
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
    </div>
  )
}

export default RSVPForChitChatForm
