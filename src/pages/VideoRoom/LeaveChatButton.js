import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
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
      history.push(`/events/${event_id}/lobby`)
    } catch (err) {
      console.log(err)
    }
  }

  const renderLeaveChatButton = TransitionModal({
    iconButton: {
      iconButtonIcon: <ExitToAppIcon />,
      color: 'primary',
      size: 'large',
    },
    modalBody:
      'Leaving so soon? 😢 Let us know why you are leaving so we can make the experience better for you in the future.',
    onAcceptButtonText: 'Never connected to my partner',
    onAcceptFunction: () => exitChat(partnerNeverConnectedMutation),
    onCloseButtonText: 'My partner was being rude',
    onCloseFunction: () => exitChat(partnerBeingRudeMutation),
  })

  return <div>{renderLeaveChatButton}</div>
}

export default LeaveChatButton
