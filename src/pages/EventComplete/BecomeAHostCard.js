import React from 'react'
import Lottie from 'react-lottie'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import * as confettiAnimation from '../../assets/confettiFalling.json'

const useStyles = makeStyles((theme) => ({
  backgroundLottie: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -99,
  },
  becomeAHostButton: {
    margin: theme.spacing(3, 0, 1, 0),
    width: '100%',
  },
  cardContainer: {
    position: 'relative',
    // backgroundColor: '#ffe7ec',
    // backgroundColor: '#fdeacd',
    // border: '1px solid #FF99AD',
    // boxShadow: '4px 4px 0 #FF99AD',
    // backgroundColor: '#d9c8f3',
    border: '2px solid #FF99AD',
    boxShadow: '4px 4px 0 #FF99AD',
    borderRadius: '4px',
    marginBottom: theme.spacing(3),
  },
  heroContent: {
    padding: theme.spacing(3, 5),
  },
}))

const BecomeAHostCard = () => {
  const classes = useStyles()
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
    <Grid container direction="column" className={classes.cardContainer}>
      <div className={classes.backgroundLottie}>
        <Lottie options={defaultOptions} height="100%" width="100%" />
      </div>
      <Grid className={classes.heroContent}>
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
