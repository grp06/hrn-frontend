import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { constants } from '../utils'

const { drawerWidth } = constants

const useStyles = makeStyles((theme) => ({
  pageWrapper: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: drawerWidth,
    },
  },
}))

const MarginLeftAppWrapper = ({ children }) => {
  const classes = useStyles()

  const { pathname } = window.location

  const userNotLoggedIn = Boolean(
    pathname === '/' ||
      pathname.includes('sign-up') ||
      pathname.includes('forgot-password') ||
      pathname.includes('set-new-password')
  )

  return <div className={!userNotLoggedIn ? classes.pageWrapper : ''}>{children}</div>
}

export default MarginLeftAppWrapper
