import React from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import { startPreEvent } from '../helpers'
import { Timer } from '.'

const useStyles = makeStyles((theme) => ({
  partyEmoji: {
    marginLeft: 10,
  },
}))

const StartEventButton = ({ eventId, within30Mins, eventStartTime, status }) => {
  const classes = useStyles()
  const history = useHistory()

  if (within30Mins) {
    return (
      <>
        <Button size="large" variant="contained" disabled color="primary">
          Start Event
        </Button>
        <Timer eventStartTime={eventStartTime} subtitle="Event Starts In:" />
      </>
    )
  }
  // if we get here, it's GO TIME!
  return (
    <Button size="large" variant="contained" color="primary" onClick={() => startPreEvent(eventId)}>
      Start pre-event speech
      <span className={classes.partyEmoji} role="img" aria-label="party emoji">
        🥳
      </span>
    </Button>
  )
}

export default StartEventButton

// <Button size="large" variant="contained" color="primary" onClick={() => startEvent(eventId)}>
//   Start Event
//   <span className={classes.partyEmoji} role="img" aria-label="party emoji">
//     🥳
//   </span>
// </Button>
