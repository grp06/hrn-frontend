import React, { useState } from 'react'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { motion } from 'framer-motion'
import { useHistory } from 'react-router-dom'

import { EnterprisePlanCard, getPricingPlanDetails, PricingHeroNew, PricingPlanCard } from '.'
import { ToggleGroup } from '../../common'

const useStyles = makeStyles((theme) => ({
  divider: {
    width: '80vw',
    margin: theme.spacing(6, 'auto'),
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(5, 'auto'),
    },
  },
  sectionHeading: {
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      marginBottom: theme.spacing(2),
    },
  },
  sectionPadding: {
    width: '80%',
    maxWidth: '1550px',
    margin: theme.spacing(0, 'auto'),
  },
}))

const Pricing = () => {
  const classes = useStyles()
  const history = useHistory()
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const { freePlan, plusPlan, proPlan } = getPricingPlanDetails(billingPeriod)

  const pushToCheckout = (planType, billingPeriod) => {
    if (planType === 'plus') {
      const stateToPass =
        billingPeriod === 'monthly'
          ? { planPrice: 49, plan: 'PLUS_MONTHLY' }
          : { planPrice: 39, plan: 'PLUS_YEARLY' }
      return history.push('/checkout', stateToPass)
    } else if (planType === 'pro') {
      const stateToPass =
        billingPeriod === 'monthly'
          ? { planPrice: 129, plan: 'PRO_MONTHLY' }
          : { planPrice: 99, plan: 'PRO_YEARLY' }
      return history.push('/checkout', stateToPass)
    }
  }

  return (
    <Grid container direction="column">
      <PricingHeroNew />
      <Divider className={classes.divider} />
      <Grid container className={classes.sectionPadding}>
        <Typography variant="h2" className={classes.sectionHeading}>
          Choose the right plan for your community!
        </Typography>
        <ToggleGroup
          toggleValue={billingPeriod}
          toggleValueA="monthly"
          toggleValueB="yearly"
          setToggleValue={(toggleValue) => setBillingPeriod(toggleValue)}
        />
        <Grid container direction="row" justify="space-between">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%' }}>
            <Grid container direction="row" justify="space-between">
              <PricingPlanCard plan={freePlan} />
              <PricingPlanCard
                plan={plusPlan}
                onSelect={() => pushToCheckout('plus', billingPeriod)}
              />
              <PricingPlanCard plan={proPlan} />
              <EnterprisePlanCard />
            </Grid>
          </motion.div>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Pricing
