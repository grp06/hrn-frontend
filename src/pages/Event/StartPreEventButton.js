import React from 'react'
import Typography from '@material-ui/core/Typography'
import { TransitionModal } from '../../common'
import { startPreEvent } from '../../helpers'

const StartPreEventButton = ({ eventId, timeUntilEvent, disabled }) => {
  console.log('🚀 ~ StartPreEventButton ~ disabled', disabled)
  console.log('🚀 ~ StartPreEventButton ~ timeUntilEvent', timeUntilEvent)
  console.log('🚀 ~ StartPreEventButton ~ eventId', eventId)
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
          You are about to start addressing your community! Clear your throat a few times, do some
          jumping jacks, and get ready to bring the energy to the people!{' '}
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
