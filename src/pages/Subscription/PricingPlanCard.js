import React from 'react'
import { Grid, Button, Typography, Divider } from '@material-ui/core'
import { useSubscriptionStyles } from '.'

const PricingPlanCard = ({ plan, onSelect }) => {
  const classes = useSubscriptionStyles()
  const {
    name,
    subtitle,
    price,
    prevPlanHighlights,
    highlights,
    maxAttendees,
    isActivePlan,
    disableButton,
  } = plan
  const renderHighlights = () =>
    highlights.map((highlight) => (
      <Typography variant="body1" className={classes.planHighlightTypography} key={highlight}>
        {highlight}
      </Typography>
    ))
  const renderPrevPlanHighlights = () =>
    prevPlanHighlights.map((highlight) => (
      <Typography variant="body1" className={classes.planHighlightTypography} key={highlight}>
        {highlight}
      </Typography>
    ))
  const renderMaxAttendees = () => (
    <Typography variant="body1" className={classes.planHighlightTypography}>
      {maxAttendees} Attendees
    </Typography>
  )

  return (
    <Grid
      container
      direction="column"
      className={`${classes.pricingCardContainer} ${isActivePlan && classes.activePlan}`}
    >
      <Grid container direction="column" className={classes.cardTopSection}>
        <Grid container direction="column" className={classes.planNameContainer}>
          <Typography variant="h2" className={classes.planNameTypography}>
            {name}
          </Typography>
          <Typography variant="subtitle1">{subtitle}</Typography>
        </Grid>
        <Grid container direction="column" className={classes.priceAndButtonContainer}>
          <Typography variant="h3" className={classes.priceTypography}>
            {price}
          </Typography>
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
        <Typography variant="h4">Plan Highlights</Typography>
        <Grid className={classes.planHighlightsList}>
          {renderMaxAttendees()}
          {renderPrevPlanHighlights()}
          {renderHighlights()}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default PricingPlanCard
