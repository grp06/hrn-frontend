import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Button, CircularProgress } from '@material-ui/core'
import { insertChitChatUser } from '../../gql/mutations'
import { sleep } from '../../helpers'

const RSVPForChitChatButton = ({ chitChatId, hostName, userId }) => {
  const [rsvpButtonLoading, setRsvpButtonLoading] = useState(false)
  const [insertChitChatUserMutation] = useMutation(insertChitChatUser, {
    onCompleted: () => {
      setRsvpButtonLoading(false)
      window.location.reload()
    },
  })

  const handleRSVP = async () => {
    setRsvpButtonLoading(true)
    await sleep(800)
    insertChitChatUserMutation({
      variables: {
        chit_chat_id: chitChatId,
        user_id: userId,
      },
    })
  }

  return (
    <Button
      variant="contained"
      size="large"
      color="primary"
      style={{ width: '100%' }}
      disableRipple
      disabled={rsvpButtonLoading}
      startIcon={rsvpButtonLoading ? <CircularProgress size={20} /> : null}
      onClick={handleRSVP}
    >
      Meet {hostName}
    </Button>
  )
}

export default RSVPForChitChatButton
