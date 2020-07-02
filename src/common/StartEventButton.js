import React from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/styles'
import { startPreEvent } from '../helpers'

const useStyles = makeStyles(() => ({
  partyEmoji: {
    marginLeft: 10,
  },
}))

const StartEventButton = ({ eventId, within30Mins }) => {
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
