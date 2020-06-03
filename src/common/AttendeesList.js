import React from 'react'

import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import moment from 'moment-timezone'

const AttendeesList = ({ attendees }) => {
  return (
    <List dense>
      {attendees.map(({ user }) => {
        const formattedDate = user.last_seen.slice(0, 10)
        const lastSeen = moment(formattedDate, 'YYYY-MM-DD').fromNow()
        return (
          <ListItem key={user.id}>
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.name} secondary={`Last seen: ${lastSeen}`} />
          </ListItem>
        )
      })}
    </List>
  )
}

export default AttendeesList
