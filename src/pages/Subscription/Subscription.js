import React, { useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import { motion } from 'framer-motion'
import { useHistory } from 'react-router-dom'
import { Grid, Button, Typography } from '@material-ui/core'

import {
  getPricingPlanDetails,
  getSubscriptionCheckoutObject,
  PricingPlanCard,
  useSubscriptionStyles,
} from '.'
import { ToggleGroup } from '../../common'
import { useUserContext } from '../../context'
import { upgradeToHost, sleep, createStripeCustomerPortal } from '../../helpers'
import { constants } from '../../utils'

const { ROLE, TOKEN } = constants

const Subscription = () => {
  const classes = useSubscriptionStyles()
  const history = useHistory()
  const { user } = useUserContext()
  const { id: userId, role, stripe_customer_id, sub_period_end } = user
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const { starterPlan, proPlan } = getPricingPlanDetails(billingPeriod, role)
  const userIsPayingHost = role === 'host_premium' || role === 'host_starter'

  const pushToCheckout = (billingPeriod, planType) => {
    window.analytics.track(`click ${planType} ${billingPeriod}`)
    if (!userId) {
      return history.push(`/sign-up?planType=${planType}&billingPeriod=${billingPeriod}`)
    }
    const checkoutObject = getSubscriptionCheckoutObject(billingPeriod, planType)
    return history.push('/checkout', checkoutObject)
  }

  const handleCreateCustomerPortal = async () => {
    window.analytics.track('click stripe customer portal')
    const portal = await createStripeCustomerPortal(stripe_customer_id)
    window.open(portal.url)
  }

  // const handlePlanSelect = (billingPeriod, planType) => {
  //   if (sub_period_end) {
  //     return handleCreateCustomerPortal()
  //   }
  //   return pushToCheckout(billingPeriod, planType)
  // }

  const handlePlanSelect = (planType, billingPeriod = 'forever') => {
    const planObject = {
      planType,
      billingPeriod,
    }
    localStorage.setItem('plan_type', JSON.stringify(planObject))
    return history.push('/subscription-signup')
  }

  const handleUpgradeToHost = async () => {
    if (userId) {
      try {
        const upgradeToHostResponse = await upgradeToHost(userId)
        localStorage.setItem(ROLE, 'host')
        localStorage.setItem(TOKEN, upgradeToHostResponse.token)
        window.analytics.track('upgrade to free host')
        await sleep(500)
        history.push('/checkout-success', { freeHost: true })
        return window.location.reload()
      } catch (err) {
        console.log(err)
      }
    }
    // no userId means that this person clicking doesn't have an account yet
    window.analytics.track('upgrade to free host')
    history.push('/sign-up?planType=free&billingPeriod=forever')
  }

  return (
    <Grid container direction="column" className={classes.pageContainer}>
      <Grid
        container
        alignContent="center"
        justify="center"
        className={classes.subscriptionContainer}
      >
        <Typography variant="h2" className={classes.sectionHeading}>
          Choose the right
          <br /> plan for your community!
        </Typography>
        <Typography variant="subtitle1" style={{ textAlign: 'center' }}>
          Try Hi Right Now for free, or upgrade your plan to unlock more features.
        </Typography>
        <Grid
          container
          direction="column"
          justify="center"
          alignContent="center"
          className={classes.toggleButtonContainer}
        >
          {userIsPayingHost ? (
            <>
              <Button
                variant="text"
                disableRipple
                className={classes.manageSubButton}
                onClick={handleCreateCustomerPortal}
              >
                <FeatherIcon icon="edit-2" size="20" style={{ paddingRight: '12px' }} /> Manage
                subscription
              </Button>
            </>
          ) : null}
          <ToggleGroup
            toggleValue={billingPeriod}
            toggleValueA="monthly"
            toggleValueB="yearly (SAVE20%)"
            setToggleValue={(toggleValue) => setBillingPeriod(toggleValue)}
          />
        </Grid>
        <Grid container direction="row" justify="space-between">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%' }}>
            <Grid container direction="row" justify="space-around">
              <PricingPlanCard plan={starterPlan} onSelect={() => handlePlanSelect('starter')} />
              <PricingPlanCard
                plan={proPlan}
                onSelect={() => handlePlanSelect('premium', billingPeriod)}
              />
            </Grid>
          </motion.div>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Subscription
