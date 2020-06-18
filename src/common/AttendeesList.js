import React, { useState, useEffect } from 'react'

import { useSubscription } from '@apollo/react-hooks'

import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { displayOnlineUsers } from '../gql/subscriptions'
import { constants } from '../utils'
import { useAppContext } from '../context/useAppContext'

const { lastSeenDuration } = constants

const useStyles = makeStyles((theme) => ({
  sectionHeader: {
    ...theme.typography.h3,
    color: theme.palette.common.ghostWhite,
  },
}))

const AttendeesList = ({ eventId, timeState }) => {
  const classes = useStyles()
  const [oldOnlineUsers, setOldOnlineUsers] = useState([])
  const { event } = useAppContext()
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
    if (event) {
      setOldOnlineUsers(event.event_users)
    }
  }, [event])

  useEffect(() => {
    if (!onlineUsersLoading && onlineUsersData.event_users.length && !timeState !== 'future') {
      const allUsers = onlineUsersData.event_users
      // users who've submitted a mutation within the last 10 seconds
      const freshOnlineUsers = allUsers.filter((user) => {
        const { last_seen } = user.user
        const lastSeen = new Date(last_seen).getTime()
        const diff = Date.now() - lastSeen
        // server time and local computer could be a bit off?
        // this could actually be an issue..
        // a single source of truth for online users would be preferable :(
        return diff < lastSeenDuration + 60000
      })
      // if someone comes online or goes offline
      if (freshOnlineUsers.length !== oldOnlineUsers.length) {
        setOldOnlineUsers(freshOnlineUsers)
      }
    }
  }, [onlineUsersData, timeState])

  return (
    <>
      <Typography className={classes.sectionHeader}>Online Attendees</Typography>
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
    </>
  )
}

export default AttendeesList
