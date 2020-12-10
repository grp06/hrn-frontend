import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { useUserContext } from '../context'
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
  const { userInEvent, userOnAuthRoute } = useUserContext()

  return (
    <div className={!userInEvent && !userOnAuthRoute ? classes.pageWrapper : ''}>{children}</div>
  )
}

export default MarginLeftAppWrapper
