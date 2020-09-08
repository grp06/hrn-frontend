import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import ReportProblemIcon from '@material-ui/icons/ReportProblem'
import Typography from '@material-ui/core/Typography'
import { TransitionModal } from '../../common'
import { insertExitedConvo } from '../../gql/mutations'

const LeaveChatButton = ({ myRound }) => {
  const history = useHistory()
  const { created_at, event_id, partner_id, user_id } = myRound
  const [partnerNeverConnectedMutation] = useMutation(insertExitedConvo, {
    variables: {
      convo_started_at: created_at,
      event_id,
      partner_id,
      reason: 'partner never connected',
      user_id,
    },
  })

  const [partnerBeingRudeMutation] = useMutation(insertExitedConvo, {
    variables: {
      convo_started_at: created_at,
      event_id,
      partner_id,
      reason: 'partner being rude',
      user_id,
    },
  })

  const exitChat = async (mutation) => {
    try {
      await mutation()
      localStorage.setItem('userLeftChat', true)
      history.push(`/events/${event_id}/lobby`)
    } catch (err) {
      console.log(err)
    }
  }

  const renderLeaveChatButton = TransitionModal({
    fabButton: {
      fabButtonIcon: <ReportProblemIcon />,
      fabButtonColor: 'secondary',
    },
    modalBody: (
      <div>
        <Typography variant="h5" gutterBottom>
          Leaving so soon?{' '}
          <span role="img" aria-label="cry face">
            😢
          </span>
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          We really encourage you to stick with the conversation until the end as leaving a chat
          prematurely compromises the experience for your partner.
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          But if you must leave, let us know why you&apos;re leaving so we can make the experience
          better for you in the future!
        </Typography>
      </div>
    ),
    onAcceptButtonText: 'Never connected to my partner',
    onAcceptFunction: () => exitChat(partnerNeverConnectedMutation),
    onCloseButtonText: 'My partner was being rude',
    onCloseFunction: () => exitChat(partnerBeingRudeMutation),
  })

  return <div>{renderLeaveChatButton}</div>
}

export default LeaveChatButton
