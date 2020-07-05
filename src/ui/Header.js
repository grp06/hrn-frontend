import React, { useState, useRef } from 'react'
import SettingsMenu from './SettingsMenu'
import HostControlsMenu from './HostControlsMenu'
import HostEventControlsMenu from './HostEventControlsMenu'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { useAppContext } from '../context/useAppContext'
import { Link, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'

import IconButton from '@material-ui/core/IconButton'
import FeatherIcon from 'feather-icons-react'

import logo from '../assets/logoWhite.svg'

const useStyles = makeStyles((theme) => ({
  logo: {
    height: '3em',
    [theme.breakpoints.down('s')]: {
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
}))

const Header = () => {
  const classes = useStyles()
  const history = useHistory()
  const { user, event, app, resetUser } = useAppContext()
  const { role } = user
  const { status: eventStatus, current_round } = event
  const regex = /\/events\/\d+/
  const eventIdInUrl = Boolean(window.location.pathname.match(regex))

  return (
    <>
      <AppBar position="fixed">
        <Toolbar disableGutters>
          <Button component={Link} to="/" disableRipple>
            <img alt="company-logo" className={classes.logo} src={logo} />
          </Button>
          <HostEventControlsMenu event={event} user={user} />
          {eventStatus !== 'not-started' && eventIdInUrl && (
            <Typography>
              Current Round:
              {` ${current_round || 'Pre-event'}`}
            </Typography>
          )}
          <div className={classes.grow} />
          <div>
            <IconButton color="inherit" disableRipple disabled>
              <Typography>{user.name}</Typography>
            </IconButton>
            <IconButton color="inherit" disableRipple>
              <FeatherIcon icon="users" stroke="#f4f6fa" size="24" className={classes.headerIcon} />
            </IconButton>
          </div>
          {role === 'host' && <HostControlsMenu />}
          <SettingsMenu resetUser={resetUser} />
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header
