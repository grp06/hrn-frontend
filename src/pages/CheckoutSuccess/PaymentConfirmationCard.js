import React from 'react'
import { motion } from 'framer-motion'
import { Grid, Typography } from '@material-ui/core'
import { useCheckoutSuccessStyles } from '.'
import { createStripeCustomerPortal } from '../../helpers'

const PaymentConfirmationCard = ({
  planItem,
  planPrice,
  subscriptionStarts,
  stripeCustomerId,
  subscriptionEnds,
}) => {
  console.log('🚀 ~ subscriptionEnds', subscriptionEnds)
  console.log('🚀 ~ stripeCustomerId', stripeCustomerId)
  console.log('🚀 ~ subscriptionStarts', subscriptionStarts)
  console.log('🚀 ~ planPrice', planPrice)
  console.log('🚀 ~ planItem', planItem)
  const classes = useCheckoutSuccessStyles()

  const handleCreateCustomerPortal = async () => {
    const portal = await createStripeCustomerPortal(stripeCustomerId)
    window.open(portal.url)
  }

  return (
    <motion.div
      initial={{ x: 2000 }}
      animate={{ x: 0, transition: { duration: 0.55 } }}
      className={classes.paymentConfirmationCardContainer}
    >
      <Grid container direction="column">
        <Typography variant="h2">Payment Confirmation</Typography>
        <Typography variant="h4" style={{ marginTop: '8px' }}>
          Thanks for your purchase. Here are the details of your payment:
        </Typography>
        <Grid container direction="row" className={classes.sectionMargin}>
          <Grid container item direction="column" xs={6} md={3}>
            <Typography variant="body1">Item:</Typography>
            <Typography variant="body1">Payment Date:</Typography>
            <Typography variant="body1">Payment Amount:</Typography>
          </Grid>
          <Grid container item direction="column" xs={6} md={3}>
            <Typography variant="body1">{planItem} </Typography>
            <Typography variant="body1">{subscriptionStarts} </Typography>
            <Typography variant="body1">${planPrice}.00 </Typography>
          </Grid>
        </Grid>
        <Grid container direction="column" className={classes.sectionMargin}>
          <Typography variant="body1">
            The next invoice for ${planPrice}.00 will be automatically charged on {subscriptionEnds}
          </Typography>
          <Typography
            variant="body1"
            onClick={handleCreateCustomerPortal}
            className={classes.updatePaymentLink}
          >
            Update Payment Preferences
          </Typography>
        </Grid>
      </Grid>
    </motion.div>
  )
}

export default PaymentConfirmationCard
