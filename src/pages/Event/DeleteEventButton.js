import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import FeatherIcon from 'feather-icons-react'
import Typography from '@material-ui/core/Typography'
import { TransitionModal } from '../../common'
import { deleteEvent } from '../../gql/mutations'

const DeleteEventButton = ({ eventId }) => {
  const history = useHistory()
  const [deleteEventMutation] = useMutation(deleteEvent)

  const buttonStyle = {
    maxWidth: '50px',
    maxHeight: '50px',
    border: 'none',
    backgroundColor: '#323232',
    '&:hover': {
      backgroundColor: '#2d2d2d',
    },
    marginRight: '12px',
  }

  const handleDeleteEventClick = async () => {
    try {
      await deleteEventMutation({
        variables: {
          event_id: eventId,
        },
      })
    } catch (err) {
      console.log('deleteEventMutation -> error')
      return
    }
    history.push('/events')
  }

  const modalBody = (
    <Typography variant="h4">Are you sure you want to delete your event?</Typography>
  )

  return TransitionModal({
    modalBody,
    button: {
      buttonVariant: 'outlined',
      buttonSize: 'large',
      buttonStyle,
      buttonText: <FeatherIcon icon="trash-2" stroke="#f4f6fa" size="30" />,
    },
    onAcceptButtonText: "I'm sure",
    onAcceptFunction: handleDeleteEventClick,
  })
}

export default DeleteEventButton
