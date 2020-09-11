import React, { useEffect } from 'react'

import { useSubscription, useMutation } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'
import { useHistory } from 'react-router-dom'
import { useUserContext, useAppContext, useEventContext } from '.'
import { updateLastSeen } from '../gql/mutations'
import { constants } from '../utils'

const { lastSeenDuration } = constants

const UserEventStatusContext = React.createContext()

const defaultState = {
  userEventStatus: {
    status: null,
    partner: null,
  },
}

const UserEventStatusProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  const { userEventStatus } = state
  const { user, setUserUpdatedAt } = useUserContext()
  const { event } = useEventContext()
  const { id: userId } = user
  const { setAppLoading } = useAppContext()
  const history = useHistory()

  const [updateLastSeenMutation] = useMutation(updateLastSeen, {
    variables: {
      now: new Date().toISOString(),
      id: userId,
    },
    skip: !userId,
  })

  //   console.log("user>>>", user)
  //   console.log("event>>>", event)

  //check if need to push back to lobby
  useEffect(() => {
    if (userEventStatus === 'noPartner' || userEventStatus === 'late') {
      history.push(`/events/${event.id}/lobby`)
    }
  }, [userEventStatus])

  // update last_seen on the user object every X seconds so users show up as "online" for host
  useEffect(() => {
    if (userId && (!!userEventStatus.status || userEventStatus.status !== 'sittingOut')) {
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
