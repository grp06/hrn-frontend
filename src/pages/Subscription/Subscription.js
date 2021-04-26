import React, { useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import { motion } from 'framer-motion'
import { useHistory } from 'react-router-dom'
import { Grid, Button, Typography } from '@material-ui/core'

import { getPricingPlanDetails, PricingPlanCard, useSubscriptionStyles } from '.'
import { ToggleGroup } from '../../common'
import { useUserContext } from '../../context'
import { createStripeCustomerPortal } from '../../helpers'
import { constants } from '../../utils'

const { PLAN_TYPE, ROLE, TOKEN } = constants

const Subscription = () => {
  const classes = useSubscriptionStyles()
  const history = useHistory()
  const { user } = useUserContext()
  const { id: userId, role, stripe_customer_id, sub_period_end } = user
  const [billingPeriod, setBillingPeriod] = useState('MONTHLY')
  const { freePlan, premiumPlan } = getPricingPlanDetails(billingPeriod, role)
  const userIsPayingHost = role === 'premium'

  const handleCreateCustomerPortal = async () => {
    window.analytics.track('click stripe customer portal')
    const portal = await createStripeCustomerPortal(stripe_customer_id)
    window.open(portal.url)
  }

  const handlePlanSelect = (planType) => {
    console.log('🌈 ~ handlePlanSelect ~ planType', planType)
    localStorage.setItem(PLAN_TYPE, planType)
    return history.push('/subscription-signup')
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
          <br /> plan for your team!
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
            toggleValueA="MONTHLY"
            toggleValueB="YEARLY (SAVE20%)"
            setToggleValue={(toggleValue) => setBillingPeriod(toggleValue)}
          />
        </Grid>
        <Grid container direction="row" justify="space-between">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%' }}>
            <Grid container direction="row" justify="space-around">
              <PricingPlanCard plan={freePlan} onSelect={() => handlePlanSelect('FREE')} />
              <PricingPlanCard
                plan={premiumPlan}
                onSelect={() => handlePlanSelect(`PREMIUM_${billingPeriod.split(' ')[0]}`)}
              />
            </Grid>
          </motion.div>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Subscription
