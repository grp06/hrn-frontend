import React, { useEffect } from 'react'

import { useSubscription, useMutation } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'
import { useHistory } from 'react-router-dom'
import { useUserContext, useEventContext } from '.'
import { updateEventUsersLastSeen } from '../gql/mutations'
import { constants } from '../utils'
import { listenToOnlineEventUsers } from '../gql/subscriptions'

const { lastSeenDuration, bannedUserIds } = constants

const UserEventStatusContext = React.createContext()

// status could be
// no partner
// came late
// sitting out
// left chat
// in chat
// waiting for match
// reported
const defaultState = {
  userEventStatus: 'waiting for match',
  onlineEventUsers: [],
}

const UserEventStatusProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  const { userEventStatus } = state
  const { user, setUserUpdatedAt, userInEvent } = useUserContext()
  const { event, permissions } = useEventContext()
  const { id: eventId } = event
  const { id: userId } = user
  const history = useHistory()
  const micOrCameraIsDisabled = Object.values(permissions).indexOf(false) > -1

  const [updateEventUsersLastSeenMutation] = useMutation(updateEventUsersLastSeen, {
    variables: {
      now: new Date().toISOString(),
      user_id: userId,
      event_id: eventId,
    },
    skip: !userId || !eventId,
  })

  const { data: onlineEventUsersData } = useSubscription(listenToOnlineEventUsers, {
    variables: {
      event_id: eventId,
    },
    skip: !eventId,
  })

  // check if need to push back to lobby
  useEffect(() => {
    if (userEventStatus === 'no partner' || userEventStatus === 'late') {
      history.push(`/events/${event.id}/lobby`)
    }
  }, [userEventStatus])

  // check the online user for events
  useEffect(() => {
    if (onlineEventUsersData) {
      dispatch((draft) => {
        draft.onlineEventUsers = onlineEventUsersData
      })
    }
  }, [onlineEventUsersData])

  // update last_seen on the user object every X seconds so users show up as "online" for host
  useEffect(() => {
    if (
      userId &&
      userEventStatus !== 'in chat' &&
      userEventStatus !== 'sitting out' &&
      userInEvent &&
      !micOrCameraIsDisabled
    ) {
      const interval = setInterval(async () => {
        console.log('last seen')
        try {
          if (!bannedUserIds.includes(userId)) {
            const lastSeenUpdated = await updateEventUsersLastSeenMutation()
            setUserUpdatedAt(lastSeenUpdated.data.update_event_users.returning[0].last_seen)
          }
        } catch (error) {
          console.log('interval -> error', error)
        }
      }, lastSeenDuration)
      return () => {
        clearInterval(interval)
      }
    }
  }, [userId, userEventStatus, userInEvent])

  return (
    <UserEventStatusContext.Provider value={[state, dispatch]}>
      {children}
    </UserEventStatusContext.Provider>
  )
}

export { UserEventStatusContext, UserEventStatusProvider }
