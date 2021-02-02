import React, { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
import confettiDoodles from '../../assets/confettiDoodles.svg'

import { Snack } from '../../common'
import { setNewPasswordViaSms } from '../../helpers'
import { constants } from '../../utils'

const { USER_ID, TOKEN, ROLE } = constants
const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${confettiDoodles})`,
  },
  formContainer: {
    height: 'auto',
    backgroundColor: theme.palette.common.greyCard,
    padding: theme.spacing(3),
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  formInputMargin: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(0, 1),
  },
  formSection: {
    margin: theme.spacing(4, 0),
    padding: theme.spacing(0, 1),
  },
  sectionContainer: {
    marginBottom: theme.spacing(3),
    width: '100%',
  },
  subtitleHeading: {
    color: theme.palette.common.ghostWhiteDark,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
}))

const cardElementOptions = {
  style: {
    base: {
      fontFamily: 'Muli',
      fontSize: '1rem',
      color: '#f4f6fa',
      '::placeholder': {
        color: '#f4f6fa',
      },
    },
    invalid: {
      color: '#FF99AD',
      iconColor: '#FF99AD',
    },
    complete: {},
  },
  hidePostalCode: true,
}

const CheckoutSchema = Yup.object().shape({
  password: Yup.string().min(8, 'Too Short!').required('Required'),
  passwordRepeated: Yup.string().min(8, 'Too Short!').required('Required'),
})

const SetNewPasswordForm = ({ match }) => {
  const classes = useStyles()
  const history = useHistory()
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const { userId, token } = match.params

  return (
    <Grid container direction="column" className={classes.formContainer}>
      <Formik
        initialValues={{
          password: '',
          passwordRepeated: '',
        }}
        onSubmit={async (values) => {
          setFormSubmitting(true)
          const { password, passwordRepeated } = values

          if (password !== passwordRepeated) {
            setPasswordErrorMessage('Passwords must match')
            setFormSubmitting(false)
            return
          }
          let newPasswordSetResponse
          try {
            newPasswordSetResponse = await setNewPasswordViaSms({
              password,
              userId,
              token,
            })
          } catch (err) {
            console.log('🚀 ~ onSubmit={ ~ err', err)
          }

          const { id, token: newPasswordToken, role } = newPasswordSetResponse

          window.analytics.identify(id, {
            id,
            token,
            role,
          })

          if (role === 'fan') {
            history.push('/fan-home')
          } else {
            history.push('/creator-home')
          }
          window.analytics.track('Reset password for phone number')
          localStorage.setItem(USER_ID, id)
          localStorage.setItem(ROLE, role)
          localStorage.setItem(TOKEN, newPasswordToken)

          setFormSubmitting(false)
          // I'm confused by this transition modal stuff so I'm just reloading for now - George
          window.location.reload()
        }}
        validationSchema={CheckoutSchema}
      >
        {({ submitForm, dirty, isValid, values }) => (
          <Form>
            <div className={classes.sectionContainer}>
              <Grid container direction="column" className={classes.formSection}>
                <Grid container className={classes.formInputMargin}>
                  <Field
                    component={TextField}
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid container className={classes.formInputMargin}>
                  <Field
                    component={TextField}
                    name="passwordRepeated"
                    label="Confirm password"
                    type="password"
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
            </div>
            <Grid container justify="center" alignItems="center">
              <Button
                variant="contained"
                color="primary"
                startIcon={formSubmitting ? <CircularProgress size="1rem" /> : null}
                disabled={formSubmitting || !isValid || !dirty}
                onClick={submitForm}
              >
                {formSubmitting ? 'Updating Our Ledgers ...' : 'Complete Payment'}
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
      <Snack
        open={Boolean(passwordErrorMessage)}
        onClose={() => setPasswordErrorMessage('')}
        severity="error"
        duration={3000}
        snackMessage={passwordErrorMessage}
      />
    </Grid>
  )
}

export default SetNewPasswordForm
