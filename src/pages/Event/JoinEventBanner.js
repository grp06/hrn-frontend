import React from 'react'

import { Grid, LinearProgress, Typography } from '@material-ui/core'
import { useEventStyles } from '.'

const JoinEventBanner = () => {
  console.log('hi from join event')
  const classes = useEventStyles()
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.joinEventBannerContainer}
    >
      <Grid item className={classes.joinEventBannerTextContainer}>
        <Typography variant="h3">The Event Has Started!</Typography>
        <Typography variant="body1" className={classes.yellowText}>
          Click &apos;Join Event&apos; below to join
        </Typography>
      </Grid>
      <div className={classes.linearProgressRoot}>
        <LinearProgress />
      </div>
    </Grid>
  )
}

export default JoinEventBanner
