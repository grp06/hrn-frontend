import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { motion } from 'framer-motion'

import { CheckoutCard, EnterprisePlanCard, PricingHeroNew, PricingPlanCard } from '.'
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

const basicPlan = {
  name: 'Free',
  subtitle: 'Best for individuals',
  price: 'Free!',
  maxAttendees: 30,
  prevPlanHighlights: [],
  highlights: ['Unlimited Events', 'Standard Matching'],
}

const plusPlan = {
  name: 'Plus',
  subtitle: 'Best for small communities',
  price: '$45 / month',
  maxAttendees: 300,
  prevPlanHighlights: ['Unlimited Events', 'Standard Matching'],
  highlights: ['Advanced Matching', 'Group Video', 'Event data analysis', 'Added logo'],
}

const proPlan = {
  name: 'Pro',
  subtitle: 'Best for large communities',
  price: '$99 / month',
  maxAttendees: 300,
  prevPlanHighlights: [
    'Unlimited Events',
    'Standard Matching',
    'Advanced Matching',
    'Group Video',
    'Event data analysis',
    'Added logo',
  ],
  highlights: ['Custom branding', 'Custom user tags', 'Concierge support'],
}

const Pricing = () => {
  const classes = useStyles()
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const [planCost, setPlanCost] = useState(0)
  return (
    <Grid container direction="column">
      <PricingHeroNew />
      <Divider className={classes.divider} />
      <Grid container className={classes.sectionPadding}>
        {showCheckoutForm ? (
          <Button
            variant="text"
            size="large"
            startIcon={<ArrowBackIcon />}
            disableRipple
            onClick={() => {
              setShowCheckoutForm(false)
              setPlanCost(0)
            }}
          >
            Back to plans
          </Button>
        ) : (
          <Typography variant="h2" className={classes.sectionHeading}>
            Choose the right plan for your community!
          </Typography>
        )}
        <ToggleGroup
          toggleValue={billingPeriod}
          toggleValueA="monthly"
          toggleValueB="yearly"
          setToggleValue={(toggleValue) => setBillingPeriod(toggleValue)}
        />
        <Grid container direction="row" justify="space-between">
          {!showCheckoutForm ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%' }}>
              <Grid container direction="row" justify="space-between">
                <PricingPlanCard plan={basicPlan} />
                <PricingPlanCard
                  plan={plusPlan}
                  onSelect={() => {
                    setShowCheckoutForm(true)
                    setPlanCost(4999)
                  }}
                />
                <PricingPlanCard plan={proPlan} />
                <EnterprisePlanCard />
              </Grid>
            </motion.div>
          ) : (
            <CheckoutCard />
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Pricing
