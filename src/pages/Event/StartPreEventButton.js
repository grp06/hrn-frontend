import React from 'react'
import Button from '@material-ui/core/Button'
import { startPreEvent } from '../../helpers'

const StartPreEventButton = ({ eventId, timeUntilEvent, disabled }) => {
  return (
    <Button
      size="large"
      variant="contained"
      disabled={timeUntilEvent !== 0 || disabled}
      color="secondary"
      onClick={() => startPreEvent(eventId)}
    >
      Start pre-event speech
    </Button>
  )
}

export default StartPreEventButton
