import React, { useState, useEffect } from 'react'

import { useSubscription } from '@apollo/react-hooks'
// import { withApollo } from 'react-apollo'

import { useGameContext } from '../context/useGameContext'
import { updateLastSeenMutation } from '../gql/mutations'
import { displayOnlineUsers } from '../gql/subscriptions'

const OnlineUsers = ({ client }) => {
  const [onlineIndicator, updateOnlineIndicator] = useState('')
  const { data, loading, error } = useSubscription(displayOnlineUsers)
  const { userId } = useGameContext()

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     updateOnlineIndicator(() => {
  //       client.mutate({
  //         mutation: updateLastSeenMutation,
  //         variables: {
  //           now: new Date().toISOString(),
  //           id: userId,
  //         },
  //       })
  //     })
  //   }, 100000)
  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [client])

  if (error) {
    return <div>{error.message}</div>
  }

  if (loading || !data || !data.users.length) {
    return null
  }

  return data.users.map((user) => <div key={user.id}>{user.name}</div>)
}

export default OnlineUsers
