import React, { useEffect } from 'react'

import { useMutation, useSubscription } from '@apollo/react-hooks'

import { useGameContext } from '../context/useGameContext'
import { updateLastSeen } from '../gql/mutations'
import { displayOnlineUsers } from '../gql/subscriptions'

const EventSoon = ({ eventData }) => {
  const { userId, role, eventId } = useGameContext()
  const {
    data: onlineUsersData,
    loading: onlineUsersLoading,
    error: onlineUsersError,
  } = useSubscription(displayOnlineUsers, {
    variables: {
      event_id: eventId,
    },
  })

  const [updateLaseSeenMutation] = useMutation(updateLastSeen, {
    variables: {
      now: new Date().toISOString(),
      id: userId,
    },
  })

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('update last seen')
      updateLaseSeenMutation()
    }, 3000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  if (onlineUsersError) {
    return <div>{onlineUsersError.message}</div>
  }
  console.log('onlineUsersData = ', onlineUsersData)
  if (onlineUsersLoading || !onlineUsersData || !onlineUsersData.event_users[0].length) {
    return null
  }

  console.log('onlineUsersData.event_users = ', onlineUsersData.event_users)
  return onlineUsersData.event_users.map((event_users) => {
    return <div key={event_users.user.id}>{event_users.user.name}</div>
  })
}

export default EventSoon
