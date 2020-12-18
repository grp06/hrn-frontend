import React, { useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import { motion } from 'framer-motion'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { getPricingPlanDetails, getSubscriptionCheckoutObject, PricingPlanCard } from '.'
import confettiDoodles from '../../assets/ConfettiDoodlesSmallerScale.svg'
import { ToggleGroup } from '../../common'
import { useUserContext } from '../../context'
import { upgradeToHost, sleep, createStripeCustomerPortal } from '../../helpers'

const useStyles = makeStyles((theme) => ({
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
  pageContainer: {
    backgroundImage: `url(${confettiDoodles})`,
    backgroundSize: 'auto',
    backgroundRepeat: 'repeat',
    position: 'relative',
  },
}))

const Subscription = () => {
  const classes = useStyles()
  const history = useHistory()
  const { user } = useUserContext()
  const { id: userId, role, stripe_customer_id, sub_period_end } = user
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const { freePlan, starterPlan, premiumPlan } = getPricingPlanDetails(billingPeriod, role)
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

  const handlePlanSelect = (billingPeriod, planType) => {
    if (sub_period_end) {
      return handleCreateCustomerPortal()
    }
    return pushToCheckout(billingPeriod, planType)
  }

  const handleUpgradeToHost = async () => {
    if (userId) {
      try {
        const upgradeToHostResponse = await upgradeToHost(userId)
        localStorage.setItem('token', upgradeToHostResponse.token)
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
                onSelect={() => handlePlanSelect(billingPeriod, 'starter')}
              />
              <PricingPlanCard
                plan={premiumPlan}
                onSelect={() => handlePlanSelect(billingPeriod, 'premium')}
              />
            </Grid>
          </motion.div>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Subscription
