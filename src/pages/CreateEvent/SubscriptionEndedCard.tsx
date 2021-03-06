import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Grid, Typography } from '@material-ui/core'
import { useCreateEventStyles } from '.'

interface SubscriptionEndedCardProps {
  timeSinceSubEnded: string
}

const SubscriptionEndedCard: React.FC<SubscriptionEndedCardProps> = ({ timeSinceSubEnded }) => {
  const classes = useCreateEventStyles()
  const history = useHistory()
  return (
    <Grid container direction="column" className={classes.subEndedAndUpgradePlanCardContainer}>
      <Typography variant="h2" className={classes.cardHeading}>
        You&apos;re subscription ended {timeSinceSubEnded}{' '}
        <span role="img" aria-label="distraught cat">
          🙀
        </span>
      </Typography>
      <Typography variant="h4" className={classes.subheading}>
        We would love for you to keep throwing your awesome events.
      </Typography>
      <Typography variant="h4" className={classes.subheading}>
        Click the button below to come back to the party{' '}
        <span role="img" aria-label="confetti ball">
          🎊
        </span>
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        disableRipple
        className={classes.reactivateAndUpgradeButton}
        onClick={() => history.push('/subscription')}
      >
        Reactivate my plan
      </Button>
    </Grid>
  )
}

export default SubscriptionEndedCard
