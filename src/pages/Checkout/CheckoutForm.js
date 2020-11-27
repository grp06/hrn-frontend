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

import { createSubscription, retryInvoiceWithNewPaymentMethod } from './stripeUtils'
import { Snack } from '../../common'

const useStyles = makeStyles((theme) => ({
  cardElementContainer: {
    backgroundColor: theme.palette.common.grey10,
    color: theme.palette.common.ghostWhite,
    padding: theme.spacing(1),
    borderRadius: '4px',
  },
  formContainer: {
    height: 'auto',
    backgroundColor: theme.palette.common.greyCard,
    padding: theme.spacing(3),
    width: '100%',
  },
  formInputMargin: {
    margin: theme.spacing(0.5, 0),
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
        color: '#8C57DB',
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
  name: Yup.string().min(2, 'Too Short!').required('Required'),
  addressLine1: Yup.string().min(2, 'Too Short!').required('Required'),
  city: Yup.string().min(1, 'Too Short!').required('Required'),
  state: Yup.string().min(2, 'Too Short!').required('Required'),
  postal_code: Yup.string().min(2, 'Too Short!').required('Required'),
})

const CheckoutForm = ({ plan, stripeCustomerId, userId, userEmail }) => {
  const classes = useStyles()
  const stripe = useStripe()
  const elements = useElements()
  const history = useHistory()
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [paymentErrorMessage, setPaymentErrorMessage] = useState('')

  const onSubscriptionComplete = (result) => {
    localStorage.setItem('token', result.token)
    // means that we had to retry so lets clear our local storage
    if (result && !result.subscription) {
      const subscription = { id: result.invoice.subscription }
      result.subscription = subscription
      localStorage.setItem('latestInvoicePaymentIntentStatus', '')
      localStorage.setItem('latestInvoiceId', '')
    }

    history.push('/checkout-success', result.subscription)
    return window.location.reload()
  }

  const handleFormSubmit = async (formValues) => {
    setFormSubmitting(true)
    const { name, addressLine1, city, state, postal_code } = formValues
    // if (!name || !addressLine1 || !city || !state || !postal_code) {
    //   setPaymentErrorMessage('something seems to be empty  🧐')
    //   setFormSubmitting(false)
    //   return
    // }
    console.log('formValues ->', formValues)
    const billingDetails = {
      name,
      address: {
        line1: addressLine1,
        city,
        state,
        postal_code,
      },
    }
    console.log('billingDetails ->', billingDetails)

    const cardElement = elements.getElement(CardElement)
    // If a previous payment was attempted, get the lastest invoice
    const latestInvoicePaymentIntentStatus = localStorage.getItem(
      'latestInvoicePaymentIntentStatus'
    )
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      // TODO add billing details from the form
      // billing_details: billingDetails,
    })
    if (error) {
      setFormSubmitting(false)
      setPaymentErrorMessage(error.message)
      return
    }
    const paymentMethodId = paymentMethod.id

    // If you are resubmitting the form because it failed before
    if (latestInvoicePaymentIntentStatus === 'requires_payment_method') {
      // Update the payment method and retry invoice payment
      const invoiceId = localStorage.getItem('latestInvoiceId')
      const retrySubResult = retryInvoiceWithNewPaymentMethod({
        invoiceId,
        paymentMethodId,
        plan,
        stripeCustomerId,
        userId,
        userEmail,
      })
      onSubscriptionComplete(retrySubResult)
      setFormSubmitting(false)
      return
    }
    // First time submitting the form
    const subResult = await createSubscription({
      paymentMethodId,
      plan,
      stripeCustomerId,
      stripe,
      userId,
      userEmail,
    })
    onSubscriptionComplete(subResult)
    setFormSubmitting(false)
  }

  return (
    <Grid container direction="column" className={classes.formContainer}>
      <Formik
        initialValues={{
          name: '',
          addressLine1: '',
          city: '',
          state: '',
          postal_code: '',
        }}
        onSubmit={async (values) => {
          handleFormSubmit(values)
        }}
        // validationSchema={CheckoutSchema}
      >
        {({ submitForm, dirty, isValid, values }) => (
          <Form>
            <div className={classes.sectionContainer}>
              <Grid container direction="column" className={classes.formInputMargin}>
                <Typography variant="subtitle2" className={classes.subtitleHeading}>
                  Billing Address
                </Typography>
                <Field
                  component={TextField}
                  name="addressLine1"
                  label="Address"
                  fullWidth
                  required
                />
              </Grid>
              <Grid container className={classes.formInputMargin}>
                <Field component={TextField} name="city" label="City" fullWidth required />
              </Grid>
              <Grid container>
                <Grid container item md={6} className={classes.formInputMargin}>
                  <Field component={TextField} name="state" label="State" fullWidth required />
                </Grid>
                <Grid container item md={6} className={classes.formInputMargin}>
                  <Field
                    component={TextField}
                    name="postal_code"
                    label="Postal Code"
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
            </div>
            <Typography variant="subtitle2" className={classes.subtitleHeading}>
              Payment Details
            </Typography>
            <Grid container className={classes.formInputMargin}>
              <Field component={TextField} name="name" label="Name on card" fullWidth required />
            </Grid>
            <div className={classes.cardElementContainer}>
              <CardElement options={cardElementOptions} />
            </div>
            <Grid container justify="center" alignItems="center">
              <Button
                variant="contained"
                color="primary"
                startIcon={formSubmitting ? <CircularProgress size="1rem" /> : null}
                // disabled={formSubmitting || !isValid || !dirty}
                disabled={formSubmitting}
                onClick={submitForm}
              >
                {formSubmitting ? 'Updating Our Ledgers ...' : 'Submit'}
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
      <Snack
        open={Boolean(paymentErrorMessage)}
        onClose={() => setPaymentErrorMessage('')}
        severity="error"
        duration={3000}
        snackMessage={paymentErrorMessage}
      />
    </Grid>
  )
}

export default CheckoutForm
