import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import IconButton from '@material-ui/core/IconButton'
import { useAppContext } from '../../context/useAppContext'
import {
  EventsConnectionsMenu,
  HavingIssuesButton,
  HostEventControlsMenu,
  HostControlsMenu,
  SettingsMenu,
  StartEventButton,
} from '.'

import { DrawerContent } from '.'

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
          <DrawerContent />
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
          <DrawerContent />
        </Drawer>
      </Hidden>
    </div>
  )
}

export default HeaderDrawer
