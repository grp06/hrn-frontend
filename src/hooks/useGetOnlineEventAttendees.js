import { useEffect, useState } from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { displayOnlineUsers } from '../gql/subscriptions'
import { constants } from '../utils'

const { lastSeenDuration } = constants

export default function useGetOnlineEventAttendees(event, isEventHost) {
  const { id: eventId } = event
  const [oldOnlineUsers, setOldOnlineUsers] = useState([])
  const { data: onlineUsersData, loading: onlineUsersLoading } = useSubscription(
    displayOnlineUsers,
    {
      variables: {
        event_id: eventId,
      },
      skip: !eventId || !isEventHost,
    }
  )

  useEffect(() => {
    if (event) {
      setOldOnlineUsers(event.event_users)
    }
  }, [event])

  useEffect(() => {
    if (!onlineUsersLoading && onlineUsersData && onlineUsersData.event_users.length) {
      const allUsers = onlineUsersData.event_users
      // users who've submitted a mutation within the last x seconds
      const freshOnlineUsers = allUsers.filter((user) => {
        const { updated_at } = user.user
        const lastSeen = new Date(updated_at).getTime()
        // some number in ms
        const diff = Date.now() - lastSeen

        return diff < lastSeenDuration + 20000
      })
      // if someone comes online or goes offline
      if (freshOnlineUsers.length !== oldOnlineUsers.length) {
        setOldOnlineUsers(freshOnlineUsers)
      }
    }
  }, [onlineUsersData])

  return oldOnlineUsers
}
