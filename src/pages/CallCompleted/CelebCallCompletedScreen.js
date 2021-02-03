import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Grid, Typography } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  backButton: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '150px',
    marginBottom: theme.spacing(3),
    textTransform: 'none',
    padding: 0,
    fontWeight: '300',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  bodyText: {
    marginBottom: theme.spacing(0.75),
    [theme.breakpoints.up('sm')]: {
      width: '70%',
      fontSize: '1.25rem',
    },
  },
  buttonContainer: {
    marginTop: '75px',
    [theme.breakpoints.up('sm')]: {
      alignItems: 'flex-start',
      width: '40%',
    },
  },
  header: {
    marginBottom: theme.spacing(1.5),
    [theme.breakpoints.up('sm')]: {
      fontSize: '2.125rem',
    },
  },
}))

const CelebCallCompletedScreen = ({}) => {
  const classes = useStyles()
  const history = useHistory()

  return (
    <Grid container direction="column">
      <Button
        variant="text"
        disableRipple
        className={classes.backButton}
        onClick={() => history.push('/creator-home')}
        startIcon={<ArrowBack />}
      >
        My Events
      </Button>
      <Typography variant="h3" className={classes.header}>
        Thanks for hosting with Hi Right Now!{' '}
        <span role="img" aria-label="hug arms">
          🤗
        </span>
      </Typography>
      <Typography variant="body1" className={classes.bodyText}>
        We sent everyone a link to your venmo and/or cashApp with your suggested donation amount.
      </Typography>
      <Typography variant="body1" className={classes.bodyText}>
        You deserve a few cold ones (compliments of your fans) after running this event. Here&apos;s
        to meeting your fans and making money while doing it{' '}
        <span role="img" aria-label="beers clinked">
          🍻
        </span>
      </Typography>

      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.buttonContainer}
      >
        <Button
          variant="contained"
          size="large"
          color="primary"
          className={classes.feedbackButton}
          onClick={() => console.log('TODO add feedback form')}
        >
          Give us feedback
        </Button>
      </Grid>
    </Grid>
  )
}

export default CelebCallCompletedScreen
