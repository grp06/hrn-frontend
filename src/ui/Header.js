import React, { useState, useEffect } from 'react'

import {
  AppBar,
  Toolbar,
  useScrollTrigger,
  Button,
  SwipeableDrawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Grid,
  Typography,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { useMutation } from 'react-apollo'
import { makeStyles } from '@material-ui/styles'
import { Link, useHistory } from 'react-router-dom'
import { startEvent } from '../helpers'
import { Loading, TransitionModal } from '../common'

import { useAppContext } from '../context/useAppContext'

import { deleteRounds, resetEvent } from '../gql/mutations'

import logo from '../assets/logoWhite.svg'

const useStyles = makeStyles((theme) => ({
  [theme.breakpoints.down('md')]: {
    marginBottom: '1em',
  },
  [theme.breakpoints.down('xs')]: {
    marginBottom: '0.75em',
  },
  logo: {
    height: '3em',
    [theme.breakpoints.down('md')]: {
      height: '3em',
    },
    [theme.breakpoints.down('xs')]: {
      height: '1.5em',
    },
  },
  logoContainer: {
    marginLeft: '10px',
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  tabContainer: {
    marginLeft: 'auto',
  },
  tab: {
    ...theme.typography.tab,
    minWidth: 10,
  },
  button: {
    ...theme.typography.headerButton,
    borderRadius: '30px',
    marginLeft: '50px',
    marginRight: '25px',
    height: '45px',
  },
  drawerIconContainer: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
    marginLeft: 'auto',
  },
  drawerIcon: {
    height: '35px',
    width: '35px',
  },
  drawer: {
    backgroundColor: theme.palette.common.ghostWhite,
  },
  drawerItem: {
    ...theme.typography.tab,
    opacity: 0.7,
  },
  drawerItemSelected: {
    opacity: 1,
  },
  adminPanelContainer: {
    width: '40%',
    marginLeft: 'auto',
  },
  buttonSmall: {
    fontSize: '0.8rem',
    fontFamily: 'Muli',
  },
  howdyText: {
    fontSize: '1rem',
    color: theme.palette.common.sunray,
  },
  logoutButton: {
    marginLeft: '20px',
    marginRight: '20px',
  },
  dashboardButton: {
    marginLeft: '20px',
  },
}))

const Header = ({ activeTab, setActiveTab }) => {
  const classes = useStyles()
  const history = useHistory()

  const { user, event, app, resetUser } = useAppContext()
  const { role, name: usersName, userId } = user
  const { appLoading } = app
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)
  const [openDrawer, setOpenDrawer] = useState(false)

  const [deleteRoundsMutation] = useMutation(deleteRounds)
  const [resetEventMutation] = useMutation(resetEvent, {
    variables: {
      id: event.id,
    },
  })

  // useEffect(() => {
  //   // THE FUCK IS THIS?
  //   ;[...routes].forEach((route) => {
  //     switch (window.location.pathname) {
  //       case `${route.link}`:
  //         if (activeTab !== route.activeIndex) {
  //           setActiveTab(route.activeIndex)
  //         }
  //         break
  //       default:
  //         break
  //     }
  //   })
  // }, [activeTab, routes, setActiveTab])

  // eslint-disable-next-line no-shadow
  const resetRoundsModal = TransitionModal({
    button: {
      buttonText: 'Reset Event',
      buttonVariant: 'outlined',
      buttonColor: 'secondary',
    },
    modalBody: 'This will close the game for all users.',
    onAcceptFunction: async () => {
      await deleteRoundsMutation()
      await resetEventMutation(event.id)
      await startEvent(null, true)
    },
  })

  if (appLoading) {
    return <Loading />
  }

  const routes = [
    { name: 'Home', link: '/', activeIndex: 0 },
    { name: 'My Events', link: '/myevents', activeIndex: 1 },
    { name: 'About Us', link: '/about', activeIndex: 2 },
    { name: 'Contact Us', link: '/contact', activeIndex: 3 },
    { name: 'Test', link: '/test', activeIndex: 4 },
  ]

  const handleLogout = () => {
    localStorage.clear()
    resetUser()
    history.push('/')
  }

  const drawer = (
    <>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onOpen={() => setOpenDrawer(true)}
        classes={{ paper: classes.drawer }}
      >
        <List disablePadding>
          {routes.map((route, idx) => (
            <ListItem
              key={idx}
              divider
              button
              component={Link}
              to={route.link}
              selected={activeTab === route.activeIndex}
              onClick={() => {
                setOpenDrawer(false)
                setActiveTab(route.activeIndex)
              }}
            >
              <ListItemText
                className={
                  activeTab === 0
                    ? [classes.drawerItem, classes.drawerItemSelected]
                    : classes.drawerItem
                }
                disabledTypography
              >
                {route.name}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </SwipeableDrawer>
      <IconButton
        onClick={() => setOpenDrawer(!openDrawer)}
        className={classes.drawerIconContainer}
        disableRipple
      >
        <MenuIcon className={classes.drawerIcon} />
      </IconButton>
    </>
  )

  const adminNavPanel = () => {
    const { event_id, current_round, host_id } = event
    return (
      role === 'host' &&
      current_round !== 0 &&
      host_id === userId && (
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="center"
          className={classes.adminPanelContainer}
        >
          <Grid item className={classes.tab}>
            <p>
              Curent Round:
              {current_round}
            </p>
          </Grid>
          <Grid item>{resetRoundsModal}</Grid>
        </Grid>
      )
    )
  }

  const navContent = (
    <Grid container justify="flex-end" alignItems="center">
      <Typography className={classes.howdyText}>Howdy, {usersName}! 🤠</Typography>
      {role === 'host' && (
        <Button
          color="secondary"
          variant="contained"
          onClick={() => history.push('host-dashboard')}
          className={classes.dashboardButton}
        >
          Dashboard
        </Button>
      )}
      <Button
        color="secondary"
        variant="outlined"
        onClick={handleLogout}
        className={classes.logoutButton}
      >
        Log Out
      </Button>
    </Grid>
  )

  return (
    <>
      <AppBar position="fixed">
        <Toolbar disableGutters>
          <Button
            component={Link}
            to="/"
            className={classes.logoContainer}
            onClick={() => setActiveTab(0)}
            disableRipple
          >
            <img alt="company-logo" className={classes.logo} src={logo} />
          </Button>
          {usersName && navContent}
          {event && adminNavPanel()}
          {/* {matches ? drawer : tabs} */}
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header
