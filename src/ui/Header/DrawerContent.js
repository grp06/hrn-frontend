import React from 'react'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import { useAppContext } from '../../context/useAppContext'

import {
  HostDrawerContent,
  UserDrawerContent,
  EventStatusDrawer,
  EventControlsDrawerContent,
} from '.'
import logo from '../../assets/logoWhite.svg'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
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
  const { user, event, resetUser } = useAppContext()
  const { name, role, userId } = user
  const { host_id, status: eventStatus } = event
  const regex = /\/events\/\d+/
  const eventIdInUrl = Boolean(window.location.pathname.match(regex))
  const isEventHost = host_id === userId

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
      {eventIdInUrl && <EventStatusDrawer event={event} user={user} />}
      {isEventHost && eventIdInUrl && eventStatus !== 'not-started' && (
        <EventControlsDrawerContent event={event} user={user} />
      )}
      <UserDrawerContent userName={name} resetUser={resetUser} />
      {role === 'host' && <HostDrawerContent />}
    </>
  )
}

export default DrawerContent
