import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  inEventScreenText: {
    ...theme.typography.inEventScreenText,
  },
  pageContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    background: '#111',
    height: '100vh',
    alignItems: 'center',
    flexDirection: 'column',
  },
  podcastCardContainer: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    width: '50%',
    height: '250px',
    marginTop: theme.spacing(5),
    padding: theme.spacing(3, 5),
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '90%',
      height: '300px',
    },
  },
  podcastIframe: {
    marginTop: theme.spacing(1.5),
  },
  ratingContainer: {
    margin: theme.spacing(0, 'auto'),
    width: '70%',
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
    },
  },
}))

const StartupFuelInBetweenRounds = () => {
  const classes = useStyles()
  return (
    <div className={classes.pageContainer}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.ratingContainer}
      >
        <Typography className={classes.inEventScreenText}>Hope you had a great chat!</Typography>
        <Typography className={classes.inEventScreenText}>
          Sit tight for about 5 minutes before we match you with your next partner!
        </Typography>
        <Grid
          container
          direction="column"
          justify="flex-start"
          className={classes.podcastCardContainer}
        >
          <Typography variant="body1">Get to know Hi Right Now more on our podcast!</Typography>
          <iframe
            title="hi right now podcast"
            src="https://open.spotify.com/embed-podcast/show/1Pxse9ZJjcXZLa9EkW1jSl"
            width="99%"
            height="159"
            frameBorder="0"
            allowtransparency="true"
            allow="encrypted-media"
            className={classes.podcastIframe}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default StartupFuelInBetweenRounds
