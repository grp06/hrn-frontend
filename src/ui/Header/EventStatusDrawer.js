import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

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
      <Typography className={classes.eventStatusTitle} variant="h6">
        {textToShow}
      </Typography>
    )
  }

  return renderCurrentEventStatus()
}

export default EventStatusDrawer
