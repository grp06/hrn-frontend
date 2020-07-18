import React from 'react'
import Typography from '@material-ui/core/Typography'
import { TransitionModal } from '../../common'

const modalButtonStyle = {
  color: '#D1D9EA',
  textTransform: 'none',
  fontWeight: '300',
  fontFamily: 'Muli',
}

const HavingIssuesButton = ({ event }) => {
  const { status: eventStatus } = event
  const displayButton =
    eventStatus === 'pre-event' ||
    eventStatus === 'in-between-rounds' ||
    eventStatus === 'room-in-progress'

  return displayButton
    ? TransitionModal({
        button: {
          buttonText: 'Having Issues?',
          buttonVariant: 'text',
          buttonColor: 'default',
          buttonStyle: modalButtonStyle,
        },
        modalBody: (
          <div>
            <Typography variant="h5" style={{ marginBottom: '20px' }}>
              We&apos;re really sorry to hear you&apos;re having issues{' '}
              <span role="img" aria-label="crying face">
                😭
              </span>
              .
            </Typography>
            <Typography variant="h5">
              Most problems can be solved by just refreshing this page (don&apos;t worry, you wont
              get kicked out of the event!). If problems still persist then feel free to email us at
              info@hirightnow.com.
            </Typography>
          </div>
        ),
        onAcceptButtonText: 'Sounds Good!',
        onAcceptFunction: async () => {},
        hideNoWay: true,
      })
    : null
}

export default HavingIssuesButton
