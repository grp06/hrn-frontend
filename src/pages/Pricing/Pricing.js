import React from 'react'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { PricingHero, PricingPlanCard } from '.'

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(10, 0),
  },
  pageContainer: {
    width: '75vw',
    margin: theme.spacing(10, 'auto'),
    [theme.breakpoints.down('md')]: {
      width: '90%',
      margin: theme.spacing(2, 'auto'),
    },
    [theme.breakpoints.down('sm')]: {
      width: '90%',
      margin: theme.spacing(2, 'auto'),
    },
  },
}))

const basicPlan = {
  name: 'Basic',
  subtitle: 'Best for individuals',
  price: 'Free!',
  maxAttendees: 30,
  prevPlanHighlights: [],
  highlights: ['Unlimited Events', 'Standard Matching'],
}

const proPlan = {
  name: 'Pro',
  subtitle: 'Best for small communities',
  price: '$45 per month',
  maxAttendees: 300,
  prevPlanHighlights: ['Unlimited Events', 'Standard Matching'],
  highlights: ['Advanced Matching', 'Group Video', 'Event data analysis', 'Added logo'],
}

const enterprisePlan = {
  name: 'Enterprise',
  subtitle: 'Best for large communities',
  price: 'Custom',
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
  return (
    <Grid container direction="column" className={classes.pageContainer}>
      <PricingHero />
      <Divider className={classes.divider} />
      <Grid container>
        <Typography variant="h2">Choose the right plan for your community!</Typography>
        <Grid container direction="row" justify="space-between">
          <PricingPlanCard plan={basicPlan} />
          <PricingPlanCard plan={proPlan} />
          <PricingPlanCard plan={enterprisePlan} />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Pricing
