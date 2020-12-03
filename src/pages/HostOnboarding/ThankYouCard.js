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
    padding: theme.spacing(3),
    width: '50vw',
  },
  heading: { fontWeight: 700, marginBottom: '32px' },
  letsGoButton: { marginTop: theme.spacing(2), maxWidth: '200px' },
  subheading: {
    fontWeight: 300,
    width: '80%',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      width: '90%',
    },
  },
}))

const ThankYouCard = ({ handleRedirect }) => {
  const classes = useStyles()
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1, transition: { duration: 0.8 } }}
      className={classes.cardContainer}
    >
      <Typography variant="h2" className={classes.heading}>
        You&apos;re all set!
      </Typography>
      <Typography variant="h4" className={classes.subheading}>
        Thanks for giving us some feedback{' '}
        <span role="img" aria-label="nerd smiley">
          🤓
        </span>
      </Typography>
      <Typography variant="h4" className={classes.subheading}>
        We&apos;ve granted you host access so you can now throw events for your community and
        beyond!
      </Typography>
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
