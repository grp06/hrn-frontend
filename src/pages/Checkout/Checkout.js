import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Grid } from '@material-ui/core'
import { CheckoutCard, CheckoutForm, useCheckoutStyles } from '.'
import { useUserContext } from '../../context'
import { Loading } from '../../common'
import { sleep, upgradeToHost } from '../../helpers'
import { constants, createStripeCustomer } from '../../utils'
const { PLAN_TYPE, ROLE, TOKEN } = constants

const Checkout = () => {
  const classes = useCheckoutStyles()
  const history = useHistory()
  const { user, userContextLoading } = useUserContext()
  const { id: userId, email: userEmail } = user
  const [stripeCustomerId, setStripeCustomerId] = useState('')
  const planTypeFromLS = localStorage.getItem(PLAN_TYPE)

  const redirectUserBackToSubscription = useCallback(() => {
    if (!planTypeFromLS) {
      return history.push('/subscription')
    }
  }, [history, planTypeFromLS])

  const prepareStripeId = useCallback(async () => {
    if (!userContextLoading) {
      const { email, id: userId, first_name, last_name, stripe_customer_id } = user
      console.log('🚀 ~ prepareStripeId ~ user', user)
      if (!stripe_customer_id) {
        const stripeCustomer = await createStripeCustomer({ email, first_name, last_name, userId })
        return setStripeCustomerId(stripeCustomer.customer.id)
      }
      return setStripeCustomerId(stripe_customer_id)
    }
  }, [user, userContextLoading])

  useEffect(() => {
    redirectUserBackToSubscription()
    return () => {
      localStorage.setItem('PLAN_TYPE', '')
    }
  }, [redirectUserBackToSubscription])

  useEffect(() => {
    if (planTypeFromLS) {
      prepareStripeId()
    }
    // if (planTypeFromLS && planTypeFromLS.billingPeriod === 'FREE_FOREVER') {
    //   makeUserFreeHost()
    // } else {
    //   prepareStripeId()
    // }
  }, [planTypeFromLS, prepareStripeId])

  if (!stripeCustomerId || planTypeFromLS.includes('FREE')) {
    return <Loading />
  }

  return (
    <Grid container justify="center" alignItems="center" className={classes.checkoutPageContainer}>
      <CheckoutCard
        form={
          <CheckoutForm
            plan={planTypeFromLS}
            stripeCustomerId={stripeCustomerId}
            userId={userId}
            userEmail={userEmail}
          />
        }
      />
    </Grid>
  )
}

export default Checkout
