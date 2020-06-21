import React from 'react'

import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import Typography from '@material-ui/core/Typography'

import { makeStyles } from '@material-ui/styles'
import { useAppContext } from '../context/useAppContext'

const useStyles = makeStyles((theme) => ({
  sectionHeader: {
    ...theme.typography.h3,
    color: theme.palette.common.ghostWhite,
  },
}))

const ListOfRSVPs = () => {
  const classes = useStyles()
  const { event } = useAppContext()
  const { event_users } = event

  return (
    <>
      <Typography className={classes.sectionHeader}>People who've signed up</Typography>
      {event_users && event_users.length ? (
        <List dense>
          {event_users.map(({ user }) => {
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
      ) : (
        <Typography variant="body1">No one has signed up yet!</Typography>
      )}
    </>
  )
}

export default ListOfRSVPs
