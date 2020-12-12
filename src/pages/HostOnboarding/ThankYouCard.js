import React from 'react'
import { motion } from 'framer-motion'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    height: 'auto',
    backgroundColor: theme.palette.common.greyCard,
    margin: theme.spacing(0, 'auto'),
    padding: theme.spacing(5),
    width: '50vw',
  },
  heading: { fontWeight: 700, marginBottom: '32px' },
  letsGoButton: { marginTop: theme.spacing(2), maxWidth: '200px' },
  subheading: {
    fontWeight: 300,
    width: '90%',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      width: '90%',
    },
  },
}))

const ThankYouCard = ({ handleRedirect, userHasBeenOnboarded }) => {
  const classes = useStyles()

  const cardMessage = userHasBeenOnboarded ? (
    <>
      <Typography variant="h2" className={classes.heading}>
        You&apos;re all set!{' '}
        <span role="img" aria-label="party smile">
          🥳
        </span>
      </Typography>
      <Typography variant="h4" className={classes.subheading}>
        Thanks for giving us some feedback, it goes a long way for us. We can&apos;t wait to see
        your community grow alongside ours{' '}
        <span role="img" aria-label="hug smiley">
          🤗
        </span>
        .
      </Typography>
      <Typography variant="h4" className={classes.subheading}>
        Click the button below and start throwing events for your community and beyond!
      </Typography>
    </>
  ) : (
    <>
      <Typography variant="h2" className={classes.heading}>
        You&apos;re almost there{' '}
        <span role="img" aria-label="smiley">
          🙂
        </span>
      </Typography>
      <Typography variant="h4" className={classes.subheading}>
        Thanks for giving us some feedback, it goes a long way for us. We can&apos;t wait to see
        your community grow alongside ours{' '}
        <span role="img" aria-label="hug smiley">
          🤗
        </span>
        .
      </Typography>
      <Typography variant="h4" className={classes.subheading}>
        Before you start hosting and attending events we need some information about you so that we
        can make the best introductions for you.
      </Typography>
    </>
  )

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1, transition: { duration: 0.8 } }}
      className={classes.cardContainer}
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