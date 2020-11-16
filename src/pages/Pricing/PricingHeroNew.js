import React from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import blurryBackground from '../../assets/blurryBackground.png'

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
  contentPadding: {
    position: 'relative',
    zIndex: 9999,
    width: '80%',
    maxWidth: '1550px',
    height: '45vh',
    margin: theme.spacing(0, 'auto'),
  },
  heading: { fontWeight: 700, marginBottom: '32px' },
  joinBasicButton: { maxWidth: '200px' },
  pinkText: { color: '#FF99AD', fontWeight: '500' },
  subheading: {
    fontWeight: 300,
    width: '55%',
    marginBottom: '32px',
    [theme.breakpoints.down('md')]: {
      width: '90%',
    },
  },
  subheadingLessMargin: { fontWeight: 300, marginBottom: '16px' },
}))

const PricingHero = () => {
  const classes = useStyles()

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
