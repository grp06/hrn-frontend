import React from 'react'
import { Grid, Button, Typography, Divider } from '@material-ui/core'
import { useSubscriptionStyles } from '.'

const PricingPlanCard = ({ plan, onSelect }) => {
  const classes = useSubscriptionStyles()
  const { name, icon, price, highlights, isActivePlan, disableButton } = plan
  const renderHighlights = () =>
    highlights.map((highlight) => (
      <Typography variant="body1" className={classes.planHighlightTypography} key={highlight}>
        {highlight.includes('Relevant') || highlight.includes('Two Sided') ? (
          <span style={{ marginLeft: '24px' }}>{highlight}</span>
        ) : (
          highlight
        )}
      </Typography>
    ))

  return (
    <Grid
      container
      direction="column"
      className={`${classes.pricingCardContainer} ${isActivePlan && classes.activePlan}`}
    >
      <Grid container direction="column" className={classes.cardTopSection}>
        <Grid container direction="column" className={classes.planNameContainer}>
          <img alt="plan-icon" className={classes.planIcon} src={icon} />
          <Typography variant="h2" className={classes.planNameTypography}>
            {name}
          </Typography>
          <Typography variant="h3" className={classes.priceTypography}>
            {price}
          </Typography>
        </Grid>
        <Grid container direction="column" className={classes.priceAndButtonContainer}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            disableRipple
            className={classes.getStartedButton}
            onClick={onSelect}
            disabled={isActivePlan || disableButton}
          >
            {isActivePlan ? 'Current Plan' : 'Get Started'}
          </Button>
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Grid container direction="column" className={classes.planHighlightsSection}>
        <Typography variant="h4" style={{ fontWeight: 700 }}>
          Plan Highlights
        </Typography>
        <Grid className={classes.planHighlightsList}>
          {name === 'Pro' ? (
            <Typography
              variant="body1"
              className={classes.planHighlightTypography}
              style={{ fontWeight: 700 }}
            >
              Everything in Starter, plus:
            </Typography>
          ) : null}
          {renderHighlights()}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default PricingPlanCard
