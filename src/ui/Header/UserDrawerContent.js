import React from 'react'
import FeatherIcon from 'feather-icons-react'
import { useHistory } from 'react-router-dom'
import { Grid, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1.5, 0, 1.5, 2.25),
    '&:hover': {
      backgroundColor: theme.palette.common.basePurple,
    },
  },
  listItemText: {
    fontFamily: 'Muli',
    color: 'ghostWhite',
    fontSize: '1rem',
    fontWeight: '300',
    marginLeft: theme.spacing(1),
  },
}))

const UserDrawerContent = ({ role, userId, usersFirstName }) => {
  const classes = useStyles()
  const history = useHistory()
  const eventRunning = Boolean(
    window.location.pathname.includes('pre-event') ||
      window.location.pathname.includes('video-room')
  )

  const loggedInRoutes = [
    {
      label: usersFirstName,
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
      url: '/my-events',
      icon: 'calendar',
    },
    {
      label: 'All Events',
      url: '/events',
      icon: 'globe',
    },
    {
      label: role && role.includes('host') ? 'Subscription' : 'Become a Host',
      url: '/subscription',
      icon: role && role.includes('host') ? 'credit-card' : 'award',
    },
  ]

  const loggedOutRoutes = [
    {
      label: 'All Events',
      url: '/events',
      icon: 'globe',
    },
    {
      label: 'Become a Host',
      url: '/subscription',
      icon: 'award',
    },
  ]

  const renderDrawers = (routes) => {
    return routes.map((route) => (
      <ListItem
        button
        disableRipple
        disabled={eventRunning}
        className={classes.listItem}
        key={route.label}
        onClick={() => history.push(route.url)}
      >
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <ListItemIcon>
            <FeatherIcon icon={route.icon} stroke="#f4f6fa" size="24" />
          </ListItemIcon>
          <ListItemText primary={route.label} className={classes.listItemText} />
        </Grid>
      </ListItem>
    ))
  }

  const renderContent = () => {
    return userId ? renderDrawers(loggedInRoutes) : renderDrawers(loggedOutRoutes)
  }

  return (
    <div>
      <List disablePadding>{renderContent()}</List>
    </div>
  )
}

export default UserDrawerContent
