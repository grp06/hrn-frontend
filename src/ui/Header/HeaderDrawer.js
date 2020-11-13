import React, { useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import { makeStyles } from '@material-ui/styles'
import IconButton from '@material-ui/core/IconButton'
import { DrawerContent } from '.'
import { useUserContext } from '../../context'
import { constants } from '../../utils'

const { drawerWidth } = constants

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.common.greyNav,
    borderRight: '1.25px solid #3e4042',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}))

const HeaderDrawer = () => {
  const classes = useStyles()
  const { user, userInEvent } = useUserContext()
  const { id: userId } = user
  const [openDrawer, setOpenDrawer] = useState(false)
  const { pathname } = window.location
  const container = window !== undefined ? () => window.document.body : undefined

  const userOnAuthRoute = Boolean(
    pathname === '/' ||
      pathname.includes('sign-up') ||
      pathname.includes('forgot-password') ||
      pathname.includes('set-new-password')
  )

  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer)
  }

  return (
    !userOnAuthRoute &&
    !userInEvent && (
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
  )
}

export default HeaderDrawer
