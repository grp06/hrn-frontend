import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import { TransitionModal } from '../../common'
import { updateLeftChat } from '../../gql/mutations'

const ConnectionIssuesButton = ({ myRound, setUserEventStatus }) => {
  const { id: row_id } = myRound
  const [leftChatMutation] = useMutation(updateLeftChat, {
    variables: {
      row_id,
      reason: 'partner never connected',
    },
  })

  const exitChat = async (mutation) => {
    try {
      await mutation()
      window.location.reload()
    } catch (err) {
      console.log(err)
    }
  }

  const renderConnectionIssuesButton = TransitionModal({
    button: {
      buttonVariant: 'text',
      buttonText: 'Connection Issues',
      buttonColor: 'default',
      buttonStyle: { textAlign: 'center' },
    },
    modalBody: (
      <div>
        <Typography variant="h5" gutterBottom>
          Having Connection Issues?{' '}
          <span role="img" aria-label="frowning face">
            😦
          </span>
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Most of our connection issues can be solved by a simple page refresh, or changing your
          camera / mic settings by pressing on the gear icon.
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          If that doesn&apos;t solve the problem, then click on the &apos;leave chat&apos; button
          below and we will try to match you with an available user for the duration of the round.
        </Typography>
      </div>
    ),
    onAcceptButtonText: 'Leave Chat',
    onAcceptFunction: () => exitChat(leftChatMutation),
    onCloseButtonText: 'Nevermind',
  })

  return <div>{renderConnectionIssuesButton}</div>
}

export default ConnectionIssuesButton
