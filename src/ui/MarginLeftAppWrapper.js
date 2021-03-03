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
  const { userInEvent, userOnAuthOrOnboarding } = useUserContext()

  return (
    <div className={!userInEvent && !userOnAuthOrOnboarding ? classes.pageWrapper : ''}>
      {children}
    </div>
  )
}

export default MarginLeftAppWrapper
