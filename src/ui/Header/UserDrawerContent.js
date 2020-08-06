import React from 'react'
import { useHistory } from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import FeatherIcon from 'feather-icons-react'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  listItemText: {
    fontFamily: 'Muli',
    color: theme.palette.common.ghostWhiteBody,
    fontSize: '1rem',
    '&:hover': { color: theme.palette.common.sunray },
  },
}))

const UserDrawerContent = () => {
  const classes = useStyles()
  const history = useHistory()
  const userDrawerRoutes = [
    {
      label: 'My Profile',
      url: '/my-profile',
      icon: 'user',
    },
    {
      label: 'Connections',
      url: '/my-connections',
      icon: 'users',
    },
    {
      label: 'My Events',
      url: '/events',
      icon: 'calendar',
    },
  ]

  return (
    <div>
      <List>
        {userDrawerRoutes.map((route) => (
          <ListItem button disableRipple key={route.label} onClick={() => history.push(route.url)}>
            <ListItemIcon>
              <FeatherIcon icon={route.icon} stroke="#f4f6fa" size="24" />
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={route.label}
              className={classes.listItemText}
            ></ListItemText>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default UserDrawerContent
