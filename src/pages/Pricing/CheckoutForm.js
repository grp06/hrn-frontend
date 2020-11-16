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
    backgroundColor: 'white',
    height: 'auto',
    width: '200px',
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
    color: theme.palette.common.basePink,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
}))

const cardElementOptions = {
  style: {
    base: {
      fontFamily: 'Muli',
      fontSize: '1rem',
      color: 'black',
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

const CheckoutForm = ({ price }) => {
  const classes = useStyles()
  const stripe = useStripe()
  const elements = useElements()

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
    // TIP: In Stripe, the amount is always the lowest denomination of your currency
    const data = await fetch(`${process.env.REACT_APP_API_URL}/api/stripe/payment-intents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ amount: 100 }),
    }).then((res) => res.json())

    console.log(data)
    const cardElement = elements.getElement(CardElement)
    const paymentMethodReq = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: billingDetails,
    })

    console.log(paymentMethodReq)
    const confirmedCardPayment = await stripe.confirmCardPayment(data.secret, {
      payment_method: paymentMethodReq.paymentMethod.id,
    })

    console.log(confirmedCardPayment)
    // create a payment intent on the server

    // client_secret of that payment intent
    // need reference to the cardElement
    // need stripe.js
    // create a payment method

    // confirm the card payments
    // payment method id
    // client secret
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
            <Grid container direction="row">
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
                  <Grid item lg={6} className={classes.formInputMargin}>
                    <Field component={TextField} name="state" label="State" fullWidth required />
                  </Grid>
                  <Grid container item lg={6} className={classes.formInputMargin}>
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
              <Grid container className={classes.cardElementContainer}>
                <CardElement options={cardElementOptions} />
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
            </Grid>
          </Form>
        )}
      </Formik>
    </Grid>
  )
}

export default CheckoutForm
