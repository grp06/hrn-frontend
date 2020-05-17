import React, { useState, useEffect } from 'react'

import { withApollo, Subscription } from 'react-apollo'

import { updateLastSeenMutation } from '../gql/mutations'
import { displayOnlineUsers } from '../gql/subscriptions'

const OnlineUsers = ({ client }) => {
  const [onlineIndicator, updateOnlineIndicator] = useState('')

  useEffect(() => {
    const userId = parseInt(localStorage.getItem('userId'), 10)
    const interval = setInterval(() => {
      updateOnlineIndicator(async () => {
        const res = await client.mutate({
          mutation: updateLastSeenMutation,
          variables: {
            now: new Date().toISOString(),
            id: userId,
          },
        })
      })
    }, 10000)
    return () => {
      clearInterval(interval)
    }
  }, [client])

  // /clean this up ti
  return (
    <Subscription
      subscription={displayOnlineUsers}
      variables={{ timeOneMinAgo: new Date(Date.now() - 600000000000).toISOString() }}
    >
      {({ error, data }) => {
        if (error) {
          return <div>error</div>
        }

        if (data) {
          return data.users.map((user) => <div key={user.id}>{user.name}</div>)
        }
        return null
      }}
    </Subscription>
  )
}

export default withApollo(OnlineUsers)
