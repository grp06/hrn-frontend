import React from 'react'
import Typography from '@material-ui/core/Typography'
import { TransitionModal } from '../../common'
import { startPreEvent } from '../../helpers'

const StartPreEventButton = ({ eventId, timeUntilEvent, disabled }) => {
  return (
    <TransitionModal
      button={{
        buttonText: 'Start pre-event speech',
        buttonVariant: 'contained',
        buttonSize: 'large',
      }}
      disabled={timeUntilEvent !== 0 || disabled}
      modalBody={
        <Typography variant="h3">
          You are about to start your welcome remarks! Are you ready?{' '}
          <span role="img" aria-label="cartwheel">
            🤸
          </span>
        </Typography>
      }
      onAcceptButtonText="I'm Ready!"
      onAcceptFunction={async () => {
        startPreEvent(eventId)
      }}
    />
  )
}

export default StartPreEventButton
