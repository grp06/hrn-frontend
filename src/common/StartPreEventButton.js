import React from 'react'
import Button from '@material-ui/core/Button'
import { startPreEvent } from '../helpers'

const StartPreEventButton = ({ eventId, within30Mins, disabled }) => {
  return (
    <Button
      size="large"
      variant="contained"
      disabled={within30Mins || disabled}
      color="primary"
      onClick={() => startPreEvent(eventId)}
    >
      Start pre-event speech
    </Button>
  )
}

export default StartPreEventButton
