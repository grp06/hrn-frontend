import React from 'react'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import FeatherIcon from 'feather-icons-react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'

import { UserDrawerContent } from '.'
import logo from '../../assets/logoWhite.svg'

const drawerWidth = 200
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  listItemText: {
    fontFamily: 'Muli',
    color: theme.palette.common.ghostWhiteBody,
    fontSize: '1rem',
  },
  logo: {
    height: '2.85em',
    [theme.breakpoints.down('md')]: {
      height: '2.5em',
    },
  },
  toolbar: theme.mixins.toolbar,
  topOfDrawer: {
    height: '100%',
  },
  userName: {
    color: theme.palette.common.ghostWhiteBody,
    '&:hover': {
      color: theme.palette.common.sunray,
    },
  },
}))

const DrawerContent = () => {
  const classes = useStyles()
  return (
    <>
      <div className={classes.toolbar}>
        <Grid container justify="center" alignItems="center" className={classes.topOfDrawer}>
          <Button component={Link} to="/" disableRipple>
            <img alt="company-logo" className={classes.logo} src={logo} />
          </Button>
        </Grid>
      </div>
      <Divider />
      <UserDrawerContent />

      <List>
        {['Profile', 'My Events', 'Connections', 'Settings', 'Host Event', 'Analytics'].map(
          (text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <FeatherIcon icon="user" stroke="#f4f6fa" size="24" />
                ) : (
                  <FeatherIcon icon="package" stroke="#f4f6fa" size="24" />
                )}
              </ListItemIcon>
              <ListItemText disableTypography primary={text} className={classes.listItemText} />
            </ListItem>
          )
        )}
      </List>
      {/* <HostEventControlsMenu event={event} user={user} /> */}
      {/* {eventStatus === 'pre-event' && (
              <MenuItem className={classes.menuItem}>{handleStartEventModal}</MenuItem>
            )} */}
      {/* <Grid container alignItems="center">
        <div className={classes.marginRight}>
          <StartEventButton event={event} user={user} />
        </div>
        {renderCurrentEventStatus()}
      </Grid>
      <div className={classes.grow} />
      {renderHeaderElements()} */}
    </>
  )
}

export default DrawerContent
