import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Grid, Typography } from '@material-ui/core'
import { useCreateEventStyles } from '.'

const UpgradePlanCard: React.FC<{}> = () => {
  const classes = useCreateEventStyles()
  const history = useHistory()
  return (
    <Grid container direction="column" className={classes.subEndedAndUpgradePlanCardContainer}>
      <Typography variant="h2" className={classes.cardHeading}>
        You&apos;ve run out of free events{' '}
        <span role="img" aria-label="distraught face">
          😫
        </span>
      </Typography>
      <Typography variant="h4" className={classes.subheading}>
        With a free host account you only get one free event.
      </Typography>
      <Typography variant="h4" className={classes.subheading}>
        Click the button below to view our plan options and upgrade your account!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        disableRipple
        className={classes.reactivateAndUpgradeButton}
        onClick={() => history.push('/subscription')}
      >
        Upgrade my plan
      </Button>
    </Grid>
  )
}

export default UpgradePlanCard
