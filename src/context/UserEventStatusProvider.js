import React, { useEffect } from 'react'

import { useSubscription, useMutation } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'
import { useHistory } from 'react-router-dom'
import { useUserContext, useAppContext, useEventContext } from '.'
import { updateLastSeen } from '../gql/mutations'
import { constants } from '../utils'
import { listenToOnlineEventUsers } from '../gql/subscriptions'

const { lastSeenDuration } = constants

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
  const { user, setUserUpdatedAt } = useUserContext()
  const { event } = useEventContext()
  const { id: eventId } = event
  const { id: userId } = user
  const history = useHistory()

  const [updateLastSeenMutation] = useMutation(updateLastSeen, {
    variables: {
      now: new Date().toISOString(),
      id: userId,
    },
    skip: !userId,
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
    console.log('userEventStatus ->', userEventStatus)
    if (userId && userEventStatus !== 'in chat' && userEventStatus !== 'sitting out') {
      const interval = setInterval(async () => {
        console.log('last seen')
        try {
          const lastSeenUpdated = await updateLastSeenMutation()
          setUserUpdatedAt(lastSeenUpdated.data.update_users.returning[0].updated_at)
        } catch (error) {
          console.log('interval -> error', error)
        }
      }, lastSeenDuration)
      return () => {
        clearInterval(interval)
      }
    }
  }, [userId, userEventStatus])

  return (
    <UserEventStatusContext.Provider value={[state, dispatch]}>
      {children}
    </UserEventStatusContext.Provider>
  )
}

export { UserEventStatusContext, UserEventStatusProvider }
