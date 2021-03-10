import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { useEventStyles } from '.'

const PodcastCard = () => {
  const classes = useEventStyles()
  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      className={classes.eventAndLobbyContentCard}
    >
      <Typography variant="h3" className={classes.eventAndLobbyContentCardTitle}>
        Hi Right Now unfiltered
      </Typography>
      <Typography variant="body1">Listen to our podcast.</Typography>
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
  )
}

export default PodcastCard
