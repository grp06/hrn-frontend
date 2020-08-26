import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  boxContainer: {
    width: '100%',
    height: '80vh',
    backgroundColor: 'blue',
  },
}))

const BroadcastBox = ({ event }) => {
  const classes = useStyles()
  const { start_at, description, event_name, host_id } = event
  return (
    <Grid
      container
      direction="column"
      justify="space-between"
      wrap="nowrap"
      className={classes.boxContainer}
    >
       
      <Grid container>
        <Typography variant="h2">{event_name}</Typography>
      </Grid>
      <Grid container>
        <Typography variant="body1">{start_at}</Typography>
      </Grid>
      <Grid container>
        <Typography variant="body1">Hosted By {host_id}</Typography>
      </Grid>
      <Grid container>
        <Typography variant="body1">{description}</Typography>
      </Grid>
    </Grid>
  )
}

export default BroadcastBox
