import React from 'react'
import Lottie from 'react-lottie'
import { motion } from 'framer-motion'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import * as successStars from '../../assets/successStars.json'

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    height: 'auto',
    backgroundColor: theme.palette.common.greyCard,
    margin: theme.spacing(0, 'auto'),
    padding: theme.spacing(5),
    width: '70vw',
  },
  heading: { fontWeight: 700, marginBottom: '32px' },
  lottieContainer: {
    width: '100%',
    height: '300px',
    [theme.breakpoints.down('sm')]: {
      height: '200px',
    },
  },
  hostFormButton: { marginTop: theme.spacing(2), maxWidth: '200px' },
  subheading: {
    fontWeight: 300,
    width: '80%',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      width: '90%',
    },
  },
  textContainer: {
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(4),
    },
  },
}))

const CongratsCard = ({ userHasDoneHostQuestionnaire }) => {
  const classes = useStyles()
  const history = useHistory()
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: successStars.default,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  const handleHostOnboardingClick = () => {
    if (!userHasDoneHostQuestionnaire) {
      return history.push('/host-onboarding')
    }
    history.push('/create-event')
  }

  return (
    <motion.div
      initial={{ x: 2000 }}
      animate={{ x: 0, transition: { duration: 0.55 } }}
      className={classes.cardContainer}
    >
      <Grid container direction="row" alignItems="center">
        <Hidden lgUp>
          <Grid container item xs={12}>
            <div className={classes.lottieContainer}>
              <Lottie options={defaultOptions} height="100%" width="100%" />
            </div>
          </Grid>
        </Hidden>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="flex-start"
          item
          lg={7}
          className={classes.textContainer}
        >
          <Typography variant="h2" className={classes.heading}>
            Congratulations! You&apos;re now a host!
          </Typography>
          <Typography variant="h4" className={classes.subheading}>
            We&apos;re excited for your badass events.{' '}
            <span role="img" aria-label="sunglass smiley">
              😎
            </span>
          </Typography>
          {!userHasDoneHostQuestionnaire ? (
            <Typography variant="h4" className={classes.subheading}>
              Help us perfect the experience of strengthening community bonds for you and others by
              answering a few questions.
            </Typography>
          ) : (
            <Typography variant="h4" className={classes.subheading}>
              Click the button below and start throwing events for your community and beyond!
            </Typography>
          )}

          <Button
            variant="contained"
            size="large"
            color="primary"
            disableRipple
            className={classes.hostFormButton}
            onClick={handleHostOnboardingClick}
          >
            Continue
          </Button>
        </Grid>
        <Hidden mdDown>
          <Grid container item lg={5}>
            <div className={classes.lottieContainer}>
              <Lottie options={defaultOptions} height="100%" width="100%" />
            </div>
          </Grid>
        </Hidden>
      </Grid>
    </motion.div>
  )
}

export default CongratsCard
