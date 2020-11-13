import React from 'react'
import { CardElement } from '@stripe/react-stripe-js'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  cardElementContainer: {
    backgroundColor: theme.palette.common.ghostWhite,
    width: '700px',
    height: 'auto',
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

  const handleFormSubmit = async () => {
    // TIP: In Stripe, the amount is always the lowest denomination of your currency
    const { data: clientSecret } = await fetch(
      `${process.env.REACT_APP_API_URL}/api/payment_intents`,
      {
        amount: price * 100,
      }
    )

    console.log(clientSecret)
    // create a payment intent on the server

    // client_secret of that payment intent
    // need reference to the cardElement
    // need stripe.js
    // create a payment method

    // confirm the card payments
    // payment method id
    // client secret
  }

  c
  return (
    <div className={classes.cardElementContainer}>
      <CardElement options={cardElementOptions} />
    </div>
  )
}

export default CheckoutForm
