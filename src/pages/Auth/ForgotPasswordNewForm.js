import React, { useState } from 'react'
import * as Yup from 'yup'
import { resetPassword } from '../../helpers'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { Formik, Form, Field } from 'formik'
import Typography from '@material-ui/core/Typography'
import { FloatCardMedium, Snack } from '../../common'
import confettiDoodles from '../../assets/confettiDoodles.svg'
import CircularProgress from '@material-ui/core/CircularProgress'
import PhoneInput from 'react-phone-input-2'

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
  formHeader: {
    textAlign: 'center',
  },
  inputContainer: {
    margin: theme.spacing(4, 0),
  },
  input: {
    marginBottom: theme.spacing(2),
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
  successMessage: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
  orLabel: {
    padding: theme.spacing(2, 0),
  },
  resetButton: {
    margin: theme.spacing(2, 0),
  },
}))

const RSVPSchema = Yup.object().shape({
  email: Yup.string().min(4, 'Too Short!'),
  phoneNumber: Yup.string().min(7, 'Too Short!'),
})

const ForgotPasswordNewForm = () => {
  const classes = useStyles()
  const [forgotPasswordFormErrorMessage, setForgotPasswordFormErrorMessage] = useState('')
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [showSentEmail, setShowSentEmail] = useState(false)

  return (
    <Grid container justidy="center" alignItems="center" className={classes.wrapper}>
      <FloatCardMedium>
        <Grid item container direction="column" md={9} xs={12} className={classes.formContainer}>
          <Grid item container direction="column" alignItems="center">
            <Grid item>
              <Typography variant="h3" className={classes.formHeader}>
                Reset Password
              </Typography>
            </Grid>
          </Grid>
          <Grid item container direction="column" className={classes.inputContainer}>
            <Formik
              initialValues={{
                phoneNumber: '',
                email: '',
              }}
              onSubmit={async (values, { setSubmitting }) => {
                setFormSubmitting(true)
                const { phoneNumber, email } = values
                if (!phoneNumber && !email) {
                  setForgotPasswordFormErrorMessage('You forgot a phone number or email')
                  setFormSubmitting(false)
                  return
                }
                try {
                  await resetPassword({ phoneNumber: `+${phoneNumber}`, email })
                } catch (error) {
                  setFormSubmitting(false)
                  console.log('error = ', error)
                }
                window.analytics.track('Reset password')

                setShowSentEmail(true)
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
                        <Field name="phoneNumber" label="Your phone number">
                          {({ form }) => (
                            <PhoneInput
                              inputProps={{ name: 'phoneNumber', autoFocus: true }}
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
                      <Typography variant="h3" className={classes.orLabel}>
                        OR
                      </Typography>
                      <Grid item xs={12} className={classes.inputMargin}>
                        <Field
                          component={TextField}
                          name="email"
                          label="Username or Email"
                          type="text"
                          // shouldnt have to do this but I don't know whats restricting the width
                          style={{ width: '100%' }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    justify="center"
                    alignItems="center"
                    className={classes.inputMargin}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={formSubmitting ? <CircularProgress size="1rem" /> : null}
                      disabled={formSubmitting || !isValid || !dirty}
                      onClick={submitForm}
                      className={classes.resetButton}
                    >
                      Reset password
                    </Button>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Grid>

          <Snack
            open={showSentEmail}
            onClose={() => setShowSentEmail(false)}
            severity="info"
            snackMessage="Reset Instructions Sent 📫"
          />
          <Snack
            open={Boolean(forgotPasswordFormErrorMessage)}
            onClose={() => setForgotPasswordFormErrorMessage('')}
            severity="error"
            duration={3000}
            snackMessage={forgotPasswordFormErrorMessage}
          />
        </Grid>
      </FloatCardMedium>
    </Grid>
  )
}

export default ForgotPasswordNewForm
