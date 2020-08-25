import React from 'react'
import Button from '@material-ui/core/Button'
import { startPreEvent } from '../../helpers'

const StartPreEventButton = ({ eventId, timeUntilEvent, disabled }) => {
  console.log('time Until Event ->', timeUntilEvent)
  return (
    <Button
      size="large"
      variant="contained"
      disabled={timeUntilEvent !== 0 || disabled}
      color="primary"
      onClick={() => startPreEvent(eventId)}
    >
      Start pre-event speech
    </Button>
  )
}

export default StartPreEventButton
