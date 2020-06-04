import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment-timezone'
import { useSubscription } from '@apollo/react-hooks'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import Avatar from '@material-ui/core/Avatar'
import { displayOnlineUsers } from '../gql/subscriptions'
import { useGameContext } from '../context/useGameContext'

const AttendeesList = () => {
  const [oldOnlineUsers, setOldOnlineUsers] = useState([])
  const { eventId } = useGameContext()
  const onlineUsersRef = useRef([])

  const {
    data: onlineUsersData,
    loading: onlineUsersLoading,
    error: onlineUsersError,
  } = useSubscription(displayOnlineUsers, {
    variables: {
      event_id: eventId,
    },
    skip: !eventId,
  })

  useEffect(() => {
    if (!onlineUsersLoading && onlineUsersData.event_users.length) {
      const allUsers = onlineUsersData.event_users
      const freshOnlineUsers = allUsers.filter((user) => {
        const { name, last_seen } = user.user
        const lastSeen = new Date(last_seen).getTime()
        const diff = Date.now() - lastSeen
        return diff < 3000
      })
      // if someone comes online or goes offline
      if (freshOnlineUsers.length !== oldOnlineUsers.length) {
        onlineUsersRef.current = freshOnlineUsers
        setOldOnlineUsers(freshOnlineUsers)
      }
    }
  }, [onlineUsersData])

  return (
    <List dense>
      {oldOnlineUsers.map(({ user }) => {
        // const formattedDate = user.last_seen.slice(0, 10)
        // const lastSeen = moment(formattedDate, 'YYYY-MM-DD').fromNow()
        return (
          <ListItem key={user.id}>
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.name} />
          </ListItem>
        )
      })}
    </List>
  )
}

export default AttendeesList
