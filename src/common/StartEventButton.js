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

  return (
    <Button
      size="large"
      variant="contained"
      disabled={within30Mins}
      color="primary"
      onClick={() => startPreEvent(eventId)}
    >
      Start pre-event speech
      <span className={classes.partyEmoji} role="img" aria-label="party emoji">
        🥳
      </span>
    </Button>
  )
}

export default StartEventButton
