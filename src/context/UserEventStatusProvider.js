import React, { useEffect } from 'react'

import { useSubscription, useMutation } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'
import { useHistory } from 'react-router-dom'
import { useUserContext, useAppContext, useEventContext } from '.'
import { updateLastSeen } from '../gql/mutations'
import { constants } from '../utils'

const { lastSeenDuration } = constants

const UserEventStatusContext = React.createContext()

// status' could be
// no partner
// late
// sitting out
// left chat
// waiting for match
// reported
const defaultState = {
  userEventStatus: 'waiting for match',
}

const UserEventStatusProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  const { userEventStatus } = state
  const { user, setUserUpdatedAt } = useUserContext()
  const { event } = useEventContext()
  const { id: userId } = user
  const history = useHistory()

  const [updateLastSeenMutation] = useMutation(updateLastSeen, {
    variables: {
      now: new Date().toISOString(),
      id: userId,
    },
    skip: !userId,
  })

  // check if need to push back to lobby
  useEffect(() => {
    if (userEventStatus === 'no partner' || userEventStatus === 'late') {
      history.push(`/events/${event.id}/lobby`)
    }
  }, [userEventStatus])

  // update last_seen on the user object every X seconds so users show up as "online" for host
  useEffect(() => {
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
