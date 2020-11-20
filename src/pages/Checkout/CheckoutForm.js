import React from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { makeStyles } from '@material-ui/core/styles'

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

const CheckoutForm = ({ customer, plan }) => {
  const classes = useStyles()
  const stripe = useStripe()
  const elements = useElements()

  const createSubscription = async ({ paymentMethodId }) => {
    const subscriptionResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/api/stripe/create-subscription`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ customerId: customer.id, paymentMethodId, plan }),
      }
    ).then((res) => res.json())

    // if the card is declined, display an error to the user
    if (subscriptionResponse.error) {
      console.log('[createSubscription error]', subscriptionResponse.error)
    }

    // TODO: have to finsih this off
  }

  const handleFormSubmit = async (formValues) => {
    const { name, email, addressLine1, city, state, postal_code } = formValues
    const billingDetails = {
      name,
      email,
      address: {
        line1: addressLine1,
        city,
        state,
        postal_code,
      },
    }

    const cardElement = elements.getElement(CardElement)

    // If a previous payment was attempted, get the lastest invoice
    // const latestInvoicePaymentIntentStatus = localStorage.getItem(
    //   'latestInvoicePaymentIntentStatus'
    // )

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      // billing_details: billingDetails,
    })

    if (error) {
      console.log('[createPaymentMethod error]', error)
      return
    }

    console.log('[PaymentMethod]', paymentMethod)
    const paymentMethodId = paymentMethod.id
    createSubscription({ paymentMethodId })

    // TIP: In Stripe, the amount is always the lowest denomination of your currency
    // const data = await fetch(`${process.env.REACT_APP_API_URL}/api/stripe/payment-intents`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Credentials': true,
    //   },
    //   body: JSON.stringify({ amount: 100 }),
    // }).then((res) => res.json())

    // const confirmedCardPayment = await stripe.confirmCardPayment(data.secret, {
    //   payment_method: paymentMethodReq.paymentMethod.id,
    // })

    // console.log(confirmedCardPayment)
  }

  return (
    <Grid container direction="column" className={classes.formContainer}>
      <Formik
        // initialValues={{
        //   name: 'John Smith',
        //   email: 'max@hirightnow.co',
        //   addressLine1: '32 sidecar lane',
        //   city: 'New York',
        //   state: 'New York',
        //   postal_code: '11378',
        // }}
        onSubmit={async (values, { setSubmitting }) => {
          handleFormSubmit(values)
        }}
      >
        {({ submitForm, isSubmitting, values }) => (
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
                disabled={isSubmitting}
                onClick={submitForm}
              >
                Submit
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
    </Grid>
  )
}

export default CheckoutForm
