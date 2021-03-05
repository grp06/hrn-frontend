import React from 'react'
import Lottie from 'react-lottie'
import { motion } from 'framer-motion'
import { useHistory } from 'react-router-dom'
import { Button, Grid, Hidden, Typography } from '@material-ui/core'
import { useCheckoutSuccessStyles } from '.'
import * as successStars from '../../assets/successStars.json'

const CongratsCard = ({ userHasDoneHostQuestionnaire }) => {
  const classes = useCheckoutSuccessStyles()
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
      className={classes.congratsCardContainer}
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
          <Typography variant="h2" className={classes.congratsHeading}>
            Congratulations! You&apos;re now a host!
          </Typography>
          <Typography variant="h4" className={classes.congratsSubheading}>
            We&apos;re excited for your badass events.{' '}
            <span role="img" aria-label="sunglass smiley">
              😎
            </span>
          </Typography>
          {!userHasDoneHostQuestionnaire ? (
            <Typography variant="h4" className={classes.congratsSubheading}>
              Help us perfect the experience of strengthening community bonds for you and others by
              answering a few questions.
            </Typography>
          ) : (
            <Typography variant="h4" className={classes.congratsSubheading}>
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
