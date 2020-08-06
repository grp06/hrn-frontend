import React from 'react'
import { useHistory } from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import FeatherIcon from 'feather-icons-react'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  drawerTitle: {
    textAlign: 'center',
    color: '#818588',
    marginBottom: theme.spacing(0.5),
  },
  listItemText: {
    fontFamily: 'Muli',
    color: theme.palette.common.ghostWhiteBody,
    fontSize: '1rem',
    '&:hover': { color: theme.palette.common.sunray },
  },
}))

const HostDrawerContent = () => {
  const classes = useStyles()
  const history = useHistory()

  const hostDrawerRoutes = [
    {
      label: 'Host An Event',
      url: '/create-event',
      icon: 'plus-circle',
    },
    {
      label: 'Event Analytics',
      url: '/host-dashboard',
      icon: 'bar-chart-2',
    },
  ]

  return (
    <div>
      <List>
        <Typography variant="subtitle2" className={classes.drawerTitle}>
          - Host Controls -
        </Typography>
        {hostDrawerRoutes.map((route) => (
          <ListItem button disableRipple key={route.label} onClick={() => history.push(route.url)}>
            <ListItemIcon>
              <FeatherIcon icon={route.icon} stroke="#f4f6fa" size="24" />
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={route.label}
              className={classes.listItemText}
            />
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default HostDrawerContent
