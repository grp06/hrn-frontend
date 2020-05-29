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
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { useMutation } from 'react-apollo'
import { makeStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'
import { useGameContext } from '../context/useGameContext'
import endpointUrl from '../utils/endpointUrl'

import { deleteRounds } from '../gql/mutations'
import { useCreatePairings, useModalButton } from '../hooks'

import logo from '../assets/logoWhite.svg'

function ElevationScroll(props) {
  const { children } = props
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  })
}

const useStyles = makeStyles((theme) => ({
  toolbarMargin: {
    ...theme.mixins.toolbar,
    // marginBottom: '2em',
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: '1em',
  },
  [theme.breakpoints.down('xs')]: {
    marginBottom: '0.75em',
  },
  logo: {
    height: '4em',
    [theme.breakpoints.down('md')]: {
      height: '3em',
    },
    [theme.breakpoints.down('xs')]: {
      height: '2em',
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
}))

const Header = ({ activeTab, setActiveTab }) => {
  const classes = useStyles()
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)
  const { role, currentRound, users, attendees, eventId } = useGameContext()
  const { createPairings } = useCreatePairings()
  const [deleteRoundsMutation] = useMutation(deleteRounds)

  const [openDrawer, setOpenDrawer] = useState(false)

  // eslint-disable-next-line no-shadow
  const resetRoundsModal = useModalButton({
    button: {
      buttonText: 'Reset Games',
      buttonVariant: 'outlined',
      buttonColor: 'secondary',
    },
    modalBody: 'This will close the game for all users.',
    onAcceptFunction: async () => {
      await deleteRoundsMutation()
      await fetch(`${endpointUrl}/api/rooms/complete-rooms`)
    },
  })

  const routes = [
    { name: 'Home', link: '/', activeIndex: 0 },
    { name: 'My Events', link: '/myevents', activeIndex: 1 },
    { name: 'About Us', link: '/about', activeIndex: 2 },
    { name: 'Contact Us', link: '/contact', activeIndex: 3 },
    { name: 'Test', link: '/test', activeIndex: 4 },
  ]

  useEffect(() => {
    // THE FUCK IS THIS?
    ;[...routes].forEach((route) => {
      switch (window.location.pathname) {
        case `${route.link}`:
          if (activeTab !== route.activeIndex) {
            setActiveTab(route.activeIndex)
          }
          break
        default:
          break
      }
    })
  }, [activeTab, routes, setActiveTab])

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
  console.log('currentRound = ', currentRound)
  const adminNavPanel = () => {
    return (
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="center"
        className={classes.adminPanelContainer}
      >
        <Grid item className={classes.tab}>
          <p>
            Participants Online:
            {users.length}
          </p>
        </Grid>
        <Grid item className={classes.tab}>
          <p>
            Curent Round:
            {currentRound}
          </p>
        </Grid>
        <Grid item>
          <Button
            className={classes.buttonSmall}
            disableRipple
            variant="contained"
            color="secondary"
            onClick={() => createPairings(attendees, eventId)}
          >
            Next Round
          </Button>
        </Grid>
        <Grid item>
          {resetRoundsModal}
          {/* <Button
            className={classes.buttonSmall}
            disableRipple
            variant="outlined"
            color="secondary"
            onClick={async () => {
              await deleteRoundsMutation()
              await setRoundToZeroMutation()
              await fetch(`${endpointUrl}/api/rooms/complete-rooms`)
            }}
          >
            Reset Event
          </Button> */}
        </Grid>
      </Grid>
    )
  }

  return (
    <>
      <ElevationScroll>
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
            {role === 'host' && users && users.length && currentRound !== 0 && adminNavPanel()}
            {/* {matches ? drawer : tabs} */}
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <div className={classes.toolbarMargin} />
    </>
  )
}

export default Header
