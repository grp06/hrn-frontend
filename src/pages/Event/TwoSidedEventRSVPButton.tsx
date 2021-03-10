import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import { useEventStyles } from '.'
import { TransitionModal } from '../../common'
import { insertEventUser } from '../../gql/mutations'
import { EventObjectInterface, rsvpForEvent, UserObjectInterface } from '../../utils'

export interface TwoSidedEventRSPButtonProps {
  event: EventObjectInterface
  user: UserObjectInterface
}

const TwoSidedEventRSPButton: React.FC<TwoSidedEventRSPButtonProps> = ({ event, user }) => {
  const classes = useEventStyles()
  const history = useHistory()
  const { id: event_id, side_a, side_b } = event
  const { email: usersEmail, id: user_id, name: usersName } = user
  const [selectedSide, setSelectedSide] = useState<string>('')

  const [insertTwoSidedEventUserMutation] = useMutation(insertEventUser, {
    variables: {
      event_id,
      user_id,
      side: selectedSide,
    },
  })

  const insertTwoSidedEventUser = async () => {
    await rsvpForEvent(event, insertTwoSidedEventUserMutation, usersEmail, usersName)
  }

  useEffect(() => {
    if (selectedSide) {
      insertTwoSidedEventUser()
      setSelectedSide('')
    }
  }, [selectedSide])

  const handleRSVPClick = (side: string) => {
    if (!user_id) {
      localStorage.setItem('eventId', event_id.toString())
      localStorage.setItem('twoSidedSide', side)
      return history.push('/sign-up')
    }
    setSelectedSide(side)
  }

  return side_a && side_b ? (
    <TransitionModal
      button={{
        buttonText: 'RSVP',
        buttonColor: 'primary',
        buttonSize: 'large',
      }}
      modalBody={
        <>
          <Typography variant="h3" className={classes.twoSidedModalHeader}>
            Let&apos;s spice things up a bit{' '}
            <span role="img" aria-label="smirking face">
              😏
            </span>
          </Typography>
          <Typography variant="body1" className={classes.twoSidedModalBody}>
            This is a <span style={{ fontWeight: 600 }}>two-sided</span> event, meaning we strictly
            only match one side with the other. Choose the side that best describes you.
          </Typography>
        </>
      }
      onAcceptButtonText={side_a}
      onCloseButtonText={side_b}
      onAcceptFunction={() => handleRSVPClick('a')}
      onCloseFunction={() => handleRSVPClick('b')}
    />
  ) : null
}

export default TwoSidedEventRSPButton
