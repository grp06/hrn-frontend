import React, { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { Button, CircularProgress, Grid, Typography } from '@material-ui/core'

import { useCheckoutStyles } from '.'
import { createSubscription, retryInvoiceWithNewPaymentMethod } from './stripeUtils'
import { Snack } from '../../common'
import { constants } from '../../utils'
const { ROLE, TOKEN } = constants

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
  name: Yup.string().min(2, 'Too Short!').required('Required'),
  addressLine1: Yup.string().min(2, 'Too Short!').required('Required'),
  city: Yup.string().min(1, 'Too Short!').required('Required'),
  state: Yup.string().min(2, 'Too Short!').required('Required'),
  postal_code: Yup.string().min(2, 'Too Short!').required('Required'),
})

const CheckoutForm = ({ plan, stripeCustomerId, userId, userEmail }) => {
  const classes = useCheckoutStyles()
  const stripe = useStripe()
  const elements = useElements()
  const history = useHistory()
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [paymentErrorMessage, setPaymentErrorMessage] = useState('')

  const onSubscriptionComplete = async (result, stripeCustomerId) => {
    const role = result.plan.includes('STARTER') ? 'host_starter' : 'host_premium'
    localStorage.setItem(ROLE, role)
    localStorage.setItem(TOKEN, result.token)
    // means that we had to retry the invoice so lets clear our local storage
    // and set the subscription to the invoice
    if (result && !result.subscription) {
      const subscription = { id: result.invoice.subscription }
      result.subscription = subscription
      localStorage.setItem('latestInvoicePaymentIntentStatus', '')
      localStorage.setItem('latestInvoiceId', '')
    }
    window.analytics.track(`successfully paid for ${result.plan}`)
    console.log('stripeCustomerId = ', stripeCustomerId)

    setTimeout(() => {
      console.log('after tracking before push')
      history.push('/checkout-success', { subscription: result.subscription, plan: result.plan })
      return window.location.reload()
    }, 1000)
  }

  const handleFormSubmit = async (formValues) => {
    setFormSubmitting(true)
    const { name, addressLine1, city, state, postal_code } = formValues
    if (!name || !addressLine1 || !city || !state || !postal_code) {
      setPaymentErrorMessage('something seems to be empty  🧐')
      setFormSubmitting(false)
      return
    }
    const billingDetails = {
      name,
      address: {
        line1: addressLine1,
        city,
        state,
        postal_code,
      },
    }
    const cardElement = elements.getElement(CardElement)
    // If a previous payment was attempted, get the lastest invoice
    const latestInvoicePaymentIntentStatus = localStorage.getItem(
      'latestInvoicePaymentIntentStatus'
    )
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: billingDetails,
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
      try {
        const retrySubResult = retryInvoiceWithNewPaymentMethod({
          invoiceId,
          paymentMethodId,
          plan,
          stripeCustomerId,
          userId,
          userEmail,
        })
        onSubscriptionComplete(retrySubResult, stripeCustomerId)
        setFormSubmitting(false)
        return
      } catch (err) {
        console.log('[retryInvoiceWithNewPaymentMethod error] ->', err)
        setPaymentErrorMessage(err.message)
        setFormSubmitting(false)
        return
      }
    }
    // First time submitting the form
    try {
      const subResult = await createSubscription({
        paymentMethodId,
        plan,
        stripeCustomerId,
        stripe,
        userId,
        userEmail,
      })

      onSubscriptionComplete(subResult, stripeCustomerId)
    } catch (err) {
      console.log('[createSubscription error] ->', err)
      setPaymentErrorMessage(err.message)
    }

    setFormSubmitting(false)
  }

  return (
    <Grid container direction="column" className={classes.checkoutFormContainer}>
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
        validationSchema={CheckoutSchema}
      >
        {({ submitForm, dirty, isValid, values }) => (
          <Form>
            <div className={classes.sectionContainer}>
              <Grid container direction="column" className={classes.checkoutFormSection}>
                <Typography variant="subtitle2" className={classes.subtitleHeading}>
                  Payment Details
                </Typography>
                <Grid container className={classes.checkoutFormInputMargin}>
                  <Field
                    component={TextField}
                    name="name"
                    label="Name on card"
                    fullWidth
                    required
                  />
                </Grid>
                <div className={classes.cardElementContainer}>
                  <CardElement options={cardElementOptions} />
                </div>
              </Grid>
              <Grid container className={classes.checkoutFormSection}>
                <Typography variant="subtitle2" className={classes.subtitleHeading}>
                  Billing Address
                </Typography>
                <Grid container className={classes.checkoutFormInputMargin}>
                  <Field
                    component={TextField}
                    name="addressLine1"
                    label="Address"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid container className={classes.checkoutFormInputMargin}>
                  <Field component={TextField} name="city" label="City" fullWidth required />
                </Grid>
                <Grid
                  container
                  item
                  md={6}
                  style={{ paddingRight: '4px' }}
                  className={classes.checkoutFormInputMargin}
                >
                  <Field component={TextField} name="state" label="State" fullWidth required />
                </Grid>
                <Grid
                  container
                  item
                  md={6}
                  style={{ paddingLeft: '4px' }}
                  className={classes.checkoutFormInputMargin}
                >
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
