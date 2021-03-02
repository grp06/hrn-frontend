import React from 'react'
import { motion } from 'framer-motion'
import { Button, Typography } from '@material-ui/core'
import { useHostOnboardingStyles } from '.'

const ThankYouCard = ({ handleRedirect, userHasBeenOnboarded }) => {
  const classes = useHostOnboardingStyles()

  const cardMessage = userHasBeenOnboarded ? (
    <>
      <Typography variant="h2" className={classes.thankYouCardHeading}>
        You&apos;re all set!{' '}
        <span role="img" aria-label="party smile">
          🥳
        </span>
      </Typography>
      <Typography variant="h4" className={classes.thankYouCardSubheading}>
        Thanks for giving us some feedback, it goes a long way for us. We can&apos;t wait to see
        your community grow alongside ours{' '}
        <span role="img" aria-label="hug smiley">
          🤗
        </span>
        .
      </Typography>
      <Typography variant="h4" className={classes.thankYouCardSubheading}>
        Click the button below and start throwing events for your community and beyond!
      </Typography>
    </>
  ) : (
    <>
      <Typography variant="h2" className={classes.thankYouCardHeading}>
        You&apos;re almost there{' '}
        <span role="img" aria-label="smiley">
          🙂
        </span>
      </Typography>
      <Typography variant="h4" className={classes.thankYouCardSubheading}>
        Thanks for giving us some feedback, it goes a long way for us. We can&apos;t wait to see
        your community grow alongside ours{' '}
        <span role="img" aria-label="hug smiley">
          🤗
        </span>
        .
      </Typography>
      <Typography variant="h4" className={classes.thankYouCardSubheading}>
        Before you start hosting and attending events we need some information about you so that we
        can make the best introductions for you.
      </Typography>
    </>
  )

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1, transition: { duration: 0.8 } }}
      className={classes.thankYouCardContainer}
    >
      {cardMessage}
      <Button
        variant="contained"
        size="large"
        color="primary"
        onClick={handleRedirect}
        className={classes.letsGoButton}
      >
        Lets Go!
      </Button>
    </motion.div>
  )
}

export default ThankYouCard
