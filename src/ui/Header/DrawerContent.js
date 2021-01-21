import React from 'react'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import { useUserContext } from '../../context'

import {
  CreateEventSidebarButton,
  HostDrawerContent,
  UserDrawerContent,
  SettingsDrawerContent,
} from '.'
import logo from '../../assets/logoWhite.svg'

const useStyles = makeStyles((theme) => ({
  bottomHalfOfDrawer: {
    height: 'auto',
    width: '100%',
  },
  container: {
    height: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  logo: {
    height: '3.5em',
    [theme.breakpoints.down('md')]: {
      height: '3em',
    },
  },
  privacyPolicyLink: {
    width: '100%',
    backgroundColor: theme.palette.common.grey10,
    fontFamily: 'Muli',
    textAlign: 'center',
    textDecoration: 'none',
    padding: theme.spacing(1.5, 0, 1.5, 0),
    fontSize: '0.8rem',
    color: theme.palette.common.ghostWhiteBody,
    '&:hover': {
      color: theme.palette.common.sunray,
    },
  },
  toolbar: theme.mixins.toolbar,
  topOfDrawer: {
    padding: theme.spacing(2.75, 0),
    height: 'auto',
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1.75, 0),
    },
  },
  topHalfOfDrawer: {
    height: 'auto',
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
  const { user, resetUser } = useUserContext()
  const { name, role, id: userId } = user
  const userIsHost = role && role.includes('host')
  const onNewApp = window.location.pathname.includes('chit-chat')

  const usersFirstName = name?.split(' ')[0]

  const loggedInRoutes =
    role === 'celeb' || role === 'fan'
      ? [
          {
            label: usersFirstName,
            url: '/my-profile',
            icon: 'user',
          },
        ]
      : [
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
          {
            label: role && role.includes('host') ? 'Subscription' : 'Become a Host',
            url: '/subscription',
            icon: role && role.includes('host') ? 'credit-card' : 'award',
          },
        ]

  const loggedOutRoutes =
    !role && onNewApp
      ? []
      : [
          {
            label: 'All Events',
            url: '/events',
            icon: 'globe',
          },
          {
            label: 'Become a Host',
            url: '/subscription',
            icon: 'award',
          },
        ]

  return (
    <>
      <Grid container justify="flex-start" className={classes.container}>
        <Grid container direction="column" className={classes.topHalfOfDrawer}>
          <div className={classes.toolbar}>
            <Grid container justify="center" alignItems="center" className={classes.topOfDrawer}>
              <Button component={Link} to="/" disableRipple>
                <img alt="company-logo" className={classes.logo} src={logo} />
              </Button>
            </Grid>
          </div>
          <Divider />
          {userIsHost && <CreateEventSidebarButton />}
          <UserDrawerContent
            routes={{ loggedInRoutes, loggedOutRoutes }}
            userId={userId}
            userName={name}
            role={role}
          />
          {userIsHost && <HostDrawerContent role={role} />}
        </Grid>

        <Grid
          container
          direction="column"
          justify="flex-end"
          alignItems="flex-start"
          className={classes.bottomHalfOfDrawer}
        >
          <SettingsDrawerContent resetUser={resetUser} userId={userId} />
          <Link to="/privacy-policy" className={classes.privacyPolicyLink}>
            Privacy Policy
          </Link>
        </Grid>
      </Grid>
    </>
  )
}

export default DrawerContent
