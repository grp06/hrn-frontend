import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { HavingIssuesButton } from '.'

const useStyles = makeStyles((theme) => ({
  eventStatusTitle: {
    textAlign: 'center',
    color: theme.palette.common.ghostWhite,
    marginTop: theme.spacing(1),
  },
}))

const EventStatusDrawer = ({ event }) => {
  const { status, num_rounds, current_round } = event
  const classes = useStyles()

  const renderCurrentEventStatus = () => {
    let textToShow
    switch (status) {
      case 'not-started':
        textToShow = null
        break
      case 'pre-event':
        textToShow = 'Welcome remarks from the host'
        break
      case 'complete':
        textToShow = 'Event Complete'
        break
      default:
        textToShow = `Round ${current_round} of ${num_rounds}`
    }
    return (
      <Grid container direction="column" justify="center" alignItems="center">
        <Typography className={classes.eventStatusTitle} variant="h6">
          {textToShow}
        </Typography>
        <HavingIssuesButton event={event} />
      </Grid>
    )
  }

  return renderCurrentEventStatus()
}

export default EventStatusDrawer
