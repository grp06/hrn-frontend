import React, { useState } from 'react'
import { Button, Divider, Grid, Hidden, Typography } from '@material-ui/core'
import { motion } from 'framer-motion'
import { useCheckoutStyles } from '.'

const CheckoutCard = ({ form, plan, price, planHighlights }) => {
  const classes = useCheckoutStyles()
  const [showMobilePlanDetails, setShowMobilePlanDetails] = useState(false)

  const renderPlanHighlights = () => {
    return planHighlights.map((highlight) => (
      <Typography variant="body1" className={classes.planHighlightTypography} key={highlight}>
        {highlight}
      </Typography>
    ))
  }

  // plan === 'STARTER_MONTLY' || 'PREMIUM_YEARLY'
  // it is in this format for the API
  const planName = plan.split('_')[0].charAt(0) + plan.split('_')[0].slice(1).toLowerCase()
  const planPeriod = plan.split('_')[1].charAt(0) + plan.split('_')[1].slice(1).toLowerCase()

  return (
    <motion.div
      initial={{ x: 2000 }}
      animate={{ x: 0, transition: { duration: 0.55 } }}
      className={classes.checkoutCardContainer}
    >
      <Grid container direction="row" alignItems="center">
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="flex-start"
          item
          md={5}
          className={classes.planNameContainer}
        >
          <Typography variant="h2">
            {planName} {planPeriod}
          </Typography>
          <Typography variant="h3" className={classes.pinkCostText}>
            ${price} <span className={classes.spanSubtitle}>/ month</span>
          </Typography>
          <Divider className={classes.divider} />
          <Hidden smDown>
            <Typography variant="h4">Plan Highlights</Typography>
            {renderPlanHighlights()}
          </Hidden>
          <Hidden mdUp>
            {showMobilePlanDetails ? (
              <>
                <Typography variant="h4">Plan Highlights</Typography>
                {renderPlanHighlights()}
              </>
            ) : null}
          </Hidden>
          <Hidden mdUp>
            <Button
              variant="text"
              color="secondary"
              disableRipple
              className={classes.showPlanDetailsButton}
              onClick={() => setShowMobilePlanDetails((prevState) => !prevState)}
            >
              {showMobilePlanDetails ? 'Hide plan details' : 'Show plan details'}
            </Button>
          </Hidden>
        </Grid>
        <Grid container item md={7}>
          {form}
        </Grid>
      </Grid>
    </motion.div>
  )
}

export default CheckoutCard
