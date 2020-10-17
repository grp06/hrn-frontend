import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: '100%',
    padding: theme.spacing(3, 5),
  },
  cardTitle: {
    margin: 0,
  },
  podcastIframe: {
    marginTop: theme.spacing(1.5),
  },
}))

const PodcastCard = () => {
  const classes = useStyles()
  return (
    <Grid container direction="column" justify="flex-start" className={classes.cardContainer}>
      <Typography variant="h2" className={classes.cardTitle}>
        About Hi Right Now
      </Typography>
      <Typography variant="body1">Listen to our podcast.</Typography>
      <iframe
        title="hi right now podcast"
        src="https://open.spotify.com/embed-podcast/show/1Pxse9ZJjcXZLa9EkW1jSl"
        width="99%"
        height="170"
        frameBorder="0"
        allowtransparency="true"
        allow="encrypted-media"
        className={classes.podcastIframe}
      />
    </Grid>
  )
}

export default PodcastCard
