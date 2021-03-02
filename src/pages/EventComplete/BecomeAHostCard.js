import React from 'react'
import Lottie from 'react-lottie'
import { useHistory } from 'react-router-dom'
import { Button, Grid, Typography } from '@material-ui/core'
import { useEventCompleteStyles } from '.'
import * as confettiAnimation from '../../assets/confettiFalling.json'

const BecomeAHostCard = () => {
  const classes = useEventCompleteStyles()
  const history = useHistory()
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: confettiAnimation.default,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  return (
    <Grid container direction="column" className={classes.becomeAHostCardContainer}>
      <div className={classes.backgroundLottie}>
        <Lottie options={defaultOptions} height="100%" width="100%" />
      </div>
      <Grid className={classes.becomeAHostHeroContent}>
        <Typography variant="h2" style={{ color: 'black', marginBottom: '8px' }}>
          Host an event on us{' '}
          <span role="img" aria-label="wink face">
            😉
          </span>
        </Typography>
        <Typography variant="h4" style={{ color: 'black' }}>
          Create an event for your community and get people involved today.
        </Typography>
        <Typography variant="h4" style={{ color: 'black' }}>
          No payments, no sign up, no hassle!
        </Typography>
        <Button
          variant="contained"
          size="large"
          color="primary"
          className={classes.becomeAHostButton}
          onClick={() => {
            window.analytics.track('become a host from event complete')
            history.push('/subscription')
          }}
        >
          Become a Host Now
        </Button>
      </Grid>
    </Grid>
  )
}

export default BecomeAHostCard
