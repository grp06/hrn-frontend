import React, { useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import { motion } from 'framer-motion'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { getPricingPlanDetails, PricingPlanCard } from '.'
import blurryBackground from '../../assets/blurryBackground.png'
import { Loading, ToggleGroup } from '../../common'
import { useAppContext, useUserContext } from '../../context'
import { upgradeToHost, sleep, createStripeCustomerPortal } from '../../helpers'

const useStyles = makeStyles((theme) => ({
  bannerGradient: {
    background:
      'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 50%, rgba(0,212,255,0) 100%)',
    height: 'auto',
    minHeight: '45vh',
    width: '100%',
    position: 'absolute',
    top: '0%',
    bottom: 'auto',
    zIndex: '-1',
  },
  blurBackground: {
    width: '100%',
    height: 'auto',
    minHeight: '45vh',
    position: 'absolute',
    zIndex: '-3',
    backgroundPosition: '50% 50% !important',
    backgroundSize: 'cover !important',
    backgroundImage: `url(${blurryBackground})`,
  },
  divider: {
    width: '80vw',
    margin: theme.spacing(6, 'auto'),
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(5, 'auto'),
    },
  },
  manageSubButton: {
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.common.basePink,
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(3),
    },
  },
  sectionHeading: {
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      marginBottom: theme.spacing(3),
      textAlign: 'center',
    },
  },
  subButtonGridContainer: {
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  subscriptionContainer: {
    width: '80%',
    maxWidth: '1550px',
    margin: theme.spacing('75px', 'auto'),
  },
}))

const Subscription = () => {
  const classes = useStyles()
  const history = useHistory()
  const { appLoading } = useAppContext()
  const { user } = useUserContext()
  const { id: userId, role, stripe_customer_id } = user
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const { freePlan, starterPlan, premiumPlan } = getPricingPlanDetails(billingPeriod, role)
  const userIsPayingHost = role === 'host_premium' || role === 'host_starter'

  const pushToCheckout = (planType, billingPeriod) => {
    if (planType === 'starter') {
      const planHighlights = starterPlan.prevPlanHighlights.concat(starterPlan.highlights)
      const stateToPass =
        billingPeriod === 'monthly'
          ? { planPrice: 59, plan: 'STARTER_MONTHLY', planHighlights }
          : { planPrice: 49, plan: 'STARTER_YEARLY', planHighlights }
      return history.push('/checkout', stateToPass)
    }

    const stateToPass =
      billingPeriod === 'monthly'
        ? { planPrice: 169, plan: 'PREMIUM_MONTHLY' }
        : { planPrice: 149, plan: 'PREMIUM_YEARLY' }
    return history.push('/checkout', stateToPass)
  }

  const handleCreateCustomerPortal = async () => {
    const portal = await createStripeCustomerPortal(stripe_customer_id)
    window.open(portal.url)
  }

  const handleUpgradeToHost = async () => {
    if (userId) {
      try {
        const upgradeToHostResponse = await upgradeToHost(userId)
        localStorage.setItem('token', upgradeToHostResponse.token)
        await sleep(500)
        history.push('/checkout-success', { freeHost: true })
        return window.location.reload()
      } catch (err) {
        console.log(err)
      }
    }
    // no userId means that this person clicking doesn't have an account yet
    history.push('/sign-up?planType=free&billingPeriod=forever')
  }

  // if (appLoading) {
  //   return <Loading />
  // }

  return (
    <Grid container direction="column">
      <Grid
        container
        direction="column"
        alignItems="flex-start"
        justify="center"
        className={classes.blurBackground}
      />
      <div className={classes.bannerGradient} />
      <Grid container className={classes.subscriptionContainer}>
        <Typography variant="h2" className={classes.sectionHeading}>
          Choose the right plan for your community!
        </Typography>
        <Grid container direction="row">
          <Grid container item xs={12} sm={6} className={classes.subButtonGridContainer}>
            <ToggleGroup
              toggleValue={billingPeriod}
              toggleValueA="monthly"
              toggleValueB="yearly"
              setToggleValue={(toggleValue) => setBillingPeriod(toggleValue)}
            />
          </Grid>
          {userIsPayingHost ? (
            <Grid
              container
              item
              xs={12}
              sm={6}
              justify="flex-end"
              className={classes.subButtonGridContainer}
            >
              <Button
                variant="text"
                disableRipple
                className={classes.manageSubButton}
                onClick={handleCreateCustomerPortal}
              >
                <FeatherIcon icon="edit-2" size="20" style={{ paddingRight: '12px' }} /> Manage
                subscription
              </Button>
            </Grid>
          ) : null}
        </Grid>
        <Grid container direction="row" justify="space-between">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%' }}>
            <Grid container direction="row" justify="space-between">
              <PricingPlanCard plan={freePlan} onSelect={() => handleUpgradeToHost()} />
              <PricingPlanCard
                plan={starterPlan}
                onSelect={() => pushToCheckout('starter', billingPeriod)}
              />
              <PricingPlanCard plan={premiumPlan} />
            </Grid>
          </motion.div>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Subscription
