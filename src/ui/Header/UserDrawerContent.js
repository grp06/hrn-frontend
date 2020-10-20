import React from 'react'
import { useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import FeatherIcon from 'feather-icons-react'
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

const UserDrawerContent = ({ userId, userName }) => {
  const classes = useStyles()
  const history = useHistory()
  const eventRunning = Boolean(
    window.location.pathname.includes('pre-event') ||
      window.location.pathname.includes('video-room')
  )
  const usersFirstName = userName && userName.split(' ')[0]

  const userDrawerRoutes = [
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
  ]

  const renderLoggedInContent = () => {
    return userDrawerRoutes.map((route) => (
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
            <FeatherIcon icon={route.icon} stroke="#FFFFFF" size="24" />
          </ListItemIcon>
          <ListItemText primary={route.label} className={classes.listItemText} />
        </Grid>
      </ListItem>
    ))
  }

  const renderContent = () => {
    return userId ? (
      renderLoggedInContent()
    ) : (
      <ListItem
        button
        disableRipple
        key="1"
        onClick={() => history.push('/events')}
        className={classes.listItem}
      >
        <Grid container direction="column" justify="center" alignItems="center">
          <ListItemIcon>
            <FeatherIcon icon="globe" stroke="#D1D9EA" size="26" />
          </ListItemIcon>
          <ListItemText disableTypography primary="All Events" className={classes.listItemText} />
        </Grid>
      </ListItem>
    )
  }

  return (
    <div>
      <List disablePadding>{renderContent()}</List>
    </div>
  )
}

export default UserDrawerContent
