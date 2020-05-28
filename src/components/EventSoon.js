import React, { useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'

import { updateLastSeen } from '../gql/mutations'
import { useGameContext } from '../context/useGameContext'

const EventSoon = () => {
  const { userId, role } = useGameContext()

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
      }, 1000)
      return () => {
        clearInterval(interval)
      }
    }
  }, [])

  return <div>hey there</div>
}

export default EventSoon
