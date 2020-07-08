import React, { useState, useRef } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { Link, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import IconButton from '@material-ui/core/IconButton'
import FeatherIcon from 'feather-icons-react'

import logo from '../assets/logoWhite.svg'
import { StartEventButton } from '../common'
import { useAppContext } from '../context/useAppContext'
import HostEventControlsMenu from './HostEventControlsMenu'
import HostControlsMenu from './HostControlsMenu'
import SettingsMenu from './SettingsMenu'

const useStyles = makeStyles((theme) => ({
  logo: {
    height: '2.85em',
    [theme.breakpoints.down('md')]: {
      height: '2em',
    },
    [theme.breakpoints.down('xs')]: {
      height: '1.5em',
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
}))

const Header = () => {
  const classes = useStyles()
  const history = useHistory()
  const { user, event, app, resetUser } = useAppContext()
  const { role } = user
  const { status: eventStatus, current_round } = event
  const regex = /\/events\/\d+/
  const eventIdInUrl = Boolean(window.location.pathname.match(regex))

  const renderCurrentEventStatus = () => {
    if (!eventIdInUrl) return null
    let textToShow
    switch (eventStatus) {
      case 'not-started':
        textToShow = null
        break
      case 'pre-event':
        textToShow = 'Pre-event'
        break
      case 'complete':
        textToShow = 'Event Complete'
        break
      default:
        textToShow = `Current Round: ${current_round}`
    }
    return <Typography>{textToShow}</Typography>
  }
  const renderHeaderElements = () => {
    return localStorage.getItem('userId') ? (
      <Grid container justify="flex-end" alignItems="center">
        <div>
          <IconButton color="inherit" disableRipple disabled>
            <Typography>{user.name}</Typography>
          </IconButton>
          {/* <IconButton color="inherit" disableRipple>
        <FeatherIcon icon="users" stroke="#f4f6fa" size="24" className={classes.headerIcon} />
      </IconButton> */}
        </div>
        {role === 'host' && <HostControlsMenu />}
        <SettingsMenu resetUser={resetUser} />
      </Grid>
    ) : null
  }

  return (
    <>
      <AppBar position="fixed">
        <Toolbar disableGutters>
          <Button component={Link} to="/" disableRipple>
            <img alt="company-logo" className={classes.logo} src={logo} />
          </Button>
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
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header
