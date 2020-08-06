import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import IconButton from '@material-ui/core/IconButton'
import FeatherIcon from 'feather-icons-react'

import logo from '../../assets/logoWhite.svg'
import { useAppContext } from '../../context/useAppContext'
import {
  EventsConnectionsMenu,
  HavingIssuesButton,
  HostEventControlsMenu,
  HostControlsMenu,
  SettingsMenu,
  StartEventButton,
} from '.'

const drawerWidth = 200
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  logo: {
    height: '2.85em',
    [theme.breakpoints.down('md')]: {
      height: '2.5em',
    },
    // [theme.breakpoints.down('xs')]: {
    //   height: '2.5em',
    // },
  },
  userName: {
    color: theme.palette.common.ghostWhiteBody,
    '&:hover': {
      color: theme.palette.common.sunray,
    },
  },
  grow: {
    flexGrow: 1,
  },
  headerIcon: {
    '&:hover': {
      stroke: theme.palette.common.sunray,
    },
  },
  marginRight: {
    marginRight: '10px',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.common.greyCard,
  },
  toolbar: theme.mixins.toolbar,
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  topOfDrawer: {
    height: '100%',
  },
  listItemText: {
    fontFamily: 'Muli',
    color: theme.palette.common.ghostWhiteBody,
    fontSize: '1rem',
  },
}))

const HeaderDrawer = () => {
  const classes = useStyles()
  const history = useHistory()
  const { user, event, resetUser } = useAppContext()
  const { role } = user
  const { status: eventStatus, current_round } = event
  const [openDrawer, setOpenDrawer] = useState(false)
  const regex = /\/events\/\d+/
  const eventIdInUrl = Boolean(window.location.pathname.match(regex))
  const container = window !== undefined ? () => window.document.body : undefined

  const handleUserNameClick = () => {
    history.push('/my-profile')
  }

  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer)
  }

  const renderCurrentEventStatus = () => {
    if (!eventIdInUrl) return null
    const { num_rounds } = event
    let textToShow
    switch (eventStatus) {
      case 'not-started':
        textToShow = null
        break
      case 'pre-event':
        textToShow = 'Welcome remarks from the host'
        break
      case 'complete':
        textToShow = 'Event Complete'
        break
      default:
        textToShow = `Round ${current_round} of ${num_rounds}`
    }
    return <Typography variant="subtitle1">{textToShow}</Typography>
  }

  const renderHeaderElements = () => {
    return localStorage.getItem('userId') ? (
      <Grid container justify="flex-end" alignItems="center">
        <div>
          <HavingIssuesButton event={event} />
        </div>
        <div>
          <IconButton color="inherit" disableRipple onClick={handleUserNameClick}>
            <Typography className={classes.userName}>{user.name}</Typography>
          </IconButton>
        </div>
        {role === 'host' && <HostControlsMenu />}
        <EventsConnectionsMenu />
        <SettingsMenu resetUser={resetUser} />
      </Grid>
    ) : null
  }

  const drawerContent = (
    <>
      <div className={classes.toolbar}>
        <Grid container justify="center" alignItems="center" className={classes.topOfDrawer}>
          <Button component={Link} to="/" disableRipple>
            <img alt="company-logo" className={classes.logo} src={logo} />
          </Button>
        </Grid>
      </div>
      <Divider />
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
      <HostEventControlsMenu event={event} user={user} />
      {/* {eventStatus === 'pre-event' && (
            <MenuItem className={classes.menuItem}>{handleStartEventModal}</MenuItem>
          )} */}
      <Grid container alignItems="center">
        <div className={classes.marginRight}>
          <StartEventButton event={event} user={user} />
        </div>
        {renderCurrentEventStatus()}
      </Grid>
      <div className={classes.grow} />
      {renderHeaderElements()}
    </>
  )

  return (
    <div className={classes.root}>
      <Hidden mdUp implementation="css">
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar disableGutters>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Hidden>
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor="left"
          classes={{ paper: classes.drawerPaper }}
          open={openDrawer}
          onClose={handleDrawerToggle}
          className={classes.drawer}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawerContent}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          variant="permanent"
          anchor="left"
          classes={{ paper: classes.drawerPaper }}
          open
          className={classes.drawer}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawerContent}
        </Drawer>
      </Hidden>
    </div>
  )
}

export default HeaderDrawer
