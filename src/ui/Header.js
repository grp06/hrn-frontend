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
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { makeStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'

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
    marginLeft: '25px',
  },
  button: {
    ...theme.typography.headerButton,
    borderRadius: '50px',
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
    backgroundColor: theme.palette.common.rebeccaPurple,
  },
  drawerItem: {
    ...theme.typography.tab,
    opacity: 0.7,
  },
  drawerItemSelected: {
    opacity: 1,
  },
}))

const Header = ({ activeTab, setActiveTab }) => {
  const classes = useStyles()
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)

  const [openDrawer, setOpenDrawer] = useState(false)

  // eslint-disable-next-line no-shadow

  const routes = [
    { name: 'Home', link: '/', activeIndex: 0 },
    { name: 'My Events', link: '/myevents', activeIndex: 1 },
    { name: 'About Us', link: '/about', activeIndex: 2 },
    { name: 'Contact Us', link: '/contact', activeIndex: 3 },
    { name: 'Test', link: '/test', activeIndex: 4 },
  ]

  useEffect(() => {
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
            {/* matches ? drawer : tabs */}
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <div className={classes.toolbarMargin} />
    </>
  )
}

export default Header
