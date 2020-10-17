import React from 'react'
import { useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import FeatherIcon from 'feather-icons-react'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  drawerTitle: {
    textAlign: 'center',
    color: '#818588',
    marginBottom: theme.spacing(0.5),
  },
  listItem: {
    padding: theme.spacing(1.75, 0),
    '&:hover': {
      backgroundColor: theme.palette.common.basePurple,
    },
  },
  listItemText: {
    fontFamily: 'Muli',
    color: theme.palette.common.ghostWhiteBody,
    fontSize: '1rem',
  },
}))

const HostDrawerContent = () => {
  const classes = useStyles()
  const history = useHistory()
  const eventRunning = Boolean(
    window.location.pathname.includes('pre-event') ||
      window.location.pathname.includes('video-room')
  )

  const hostDrawerRoutes = [
    {
      label: 'Host An Event',
      url: '/create-event',
      icon: 'plus-circle',
    },
    {
      label: 'Analytics',
      url: '/host-dashboard',
      icon: 'bar-chart-2',
    },
  ]

  return (
    <div>
      <List disablePadding>
        {hostDrawerRoutes.map((route) => (
          <ListItem
            button
            disableRipple
            disabled={eventRunning}
            key={route.label}
            onClick={() => history.push(route.url)}
            className={classes.listItem}
          >
            <Grid container direction="column" justify="center" alignItems="center">
              <ListItemIcon>
                <FeatherIcon icon={route.icon} stroke="#D1D9EA" size="26" />
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={route.label}
                className={classes.listItemText}
              />
            </Grid>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default HostDrawerContent
