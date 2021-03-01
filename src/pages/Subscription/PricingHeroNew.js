import React from 'react'
import { Grid, Button, Typography } from '@material-ui/core'
import { useSubscriptionStyles } from '.'

const PricingHero = () => {
  const classes = useSubscriptionStyles()

  return (
    <Grid container direction="column">
      <Grid container direction="column" justify="center" className={classes.contentPadding}>
        <Typography variant="h2" className={classes.heading}>
          Host your own events
        </Typography>
        <Typography variant="h3" className={classes.subheading}>
          Create events for your community or tap into the Hi Right Now community.
        </Typography>
        <Typography variant="h3" className={classes.subheadingLessMargin}>
          Try our Basic Plan for <span className={classes.pinkText}>free!</span>
        </Typography>
        <Button
          variant="contained"
          size="large"
          color="primary"
          disableRipple
          className={classes.joinBasicButton}
        >
          Join Basic
        </Button>
      </Grid>
      <Grid
        container
        direction="column"
        alignItems="flex-start"
        justify="center"
        className={classes.blurBackground}
      />
      <div className={classes.bannerGradient} />
    </Grid>
  )
}

export default PricingHero
