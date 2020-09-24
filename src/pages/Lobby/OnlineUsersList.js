import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import PersonIcon from '@material-ui/icons/Person'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  attendeesList: {
    alignSelf: 'flex-start',
  },
  noOnlineUsersText: {
    padding: theme.spacing(0, 2),
    textAlign: 'center',
  },
}))

const OnlineUsersList = ({ onlineUsers }) => {
  console.log('online event user', onlineUsers)
  const classes = useStyles()

  return onlineUsers && onlineUsers.online_users ? (
    <Grid container item direction="column" className={classes.attendeesList}>
      <List dense>
        {onlineUsers.online_users
          .sort((userA, userB) => userA.name.toLowerCase() > userB.name.toLowerCase())
          .map((user) => {
            const firstName = user.name.split(' ')[0]
            return (
              <ListItem key={user.id}>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={firstName} secondary={user.city} />
              </ListItem>
            )
          })}
      </List>
    </Grid>
  ) : (
    <Grid container justify="center" alignItems="center" style={{ height: '100%' }}>
      <Typography variant="h6" className={classes.noOnlineUsersText}>
        No online users yet{' '}
        <span role="img" aria-label="cry face">
          😢
        </span>
      </Typography>
    </Grid>
  )
}

export default OnlineUsersList
