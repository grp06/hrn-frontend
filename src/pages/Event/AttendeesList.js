import React, { useState, useEffect } from 'react'
import {
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core'
import { useSubscription } from '@apollo/react-hooks'

import { useEventStyles } from '.'
import logo from '../../assets/HRNlogoNoFrame.svg'
import { displayOnlineUsers } from '../../gql/subscriptions'
import { constants } from '../../utils'
import { useEventContext } from '../../context'

const { lastSeenDuration } = constants

const AttendeesList = ({ eventId, timeState }) => {
  const classes = useEventStyles()
  const [oldOnlineUsers, setOldOnlineUsers] = useState([])
  const { event } = useEventContext()
  const { data: onlineUsersData, loading: onlineUsersLoading } = useSubscription(
    displayOnlineUsers,
    {
      variables: {
        event_id: eventId,
      },
      skip: !eventId,
    }
  )

  useEffect(() => {
    if (event) {
      setOldOnlineUsers(event.event_users)
    }
  }, [event])

  useEffect(() => {
    if (!onlineUsersLoading && onlineUsersData?.event_users.length && !timeState !== 'future') {
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
  }, [onlineUsersData, timeState])

  return (
    <Grid container item direction="column" alignItems="center" className={classes.attendeesList}>
      <Typography variant="h3">Online Attendees</Typography>
      <List dense>
        {oldOnlineUsers.map(({ user }) => {
          return (
            <ListItem key={user.id}>
              <ListItemAvatar>
                <Avatar>
                  <img
                    alt="company-logo"
                    className={classes.attendeesAvatar}
                    src={user.profile_pic_url || logo}
                  />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name} />
            </ListItem>
          )
        })}
      </List>
    </Grid>
  )
}

export default AttendeesList
