import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'

import { useSubscription } from '@apollo/react-hooks'
import { listenToOnlineEventUsers } from '../../gql/subscriptions'

const OnlineUsersList = ({ onlineUsers }) => {
  console.log('online event user', onlineUsers)

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          <PersonIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText />
    </ListItem>
  )
}

export default OnlineUsersList
