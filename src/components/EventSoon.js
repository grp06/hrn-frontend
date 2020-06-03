import React, { useEffect } from 'react'

import { useMutation, useSubscription } from '@apollo/react-hooks'

import { useGameContext } from '../context/useGameContext'
import { updateLastSeen } from '../gql/mutations'
import { displayOnlineUsers } from '../gql/subscriptions'

const EventSoon = ({ eventData }) => {
  const { description, event_name, start_at, id } = eventData.events[0]

  const { userId, role } = useGameContext()
  const { data, loading, error } = useSubscription(displayOnlineUsers, {
    variables: {
      event_id: id,
    },
  })
  const [updateLaseSeenMutation] = useMutation(updateLastSeen, {
    variables: {
      now: new Date().toISOString(),
      id: userId,
    },
  })

  useEffect(() => {
    if (role === 'user') {
      const interval = setInterval(() => {
        console.log('update last seen')
        updateLaseSeenMutation()
      }, 3000)
      return () => {
        clearInterval(interval)
      }
    }
  }, [])

  if (error) {
    return <div>{error.message}</div>
  }
  console.log('data = ', data)
  if (loading || !data || !data.event_users[0].length) {
    return null
  }

  console.log('data.event_users = ', data.event_users)
  return data.event_users.map((event_users) => {
    return <div key={event_users.user.id}>{event_users.user.name}</div>
  })
}

export default EventSoon
