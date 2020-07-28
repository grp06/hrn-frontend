import React from 'react'
import { useHistory } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import IconButton from '@material-ui/core/IconButton'

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

const useStyles = makeStyles((theme) => ({
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
}))

const Header = () => {
  const classes = useStyles()
  const history = useHistory()
  const { user, event, resetUser } = useAppContext()
  const { role } = user
  const { status: eventStatus, current_round } = event
  const regex = /\/events\/\d+/
  const eventIdInUrl = Boolean(window.location.pathname.match(regex))

  const handleUserNameClick = () => {
    history.push('/my-profile')
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
