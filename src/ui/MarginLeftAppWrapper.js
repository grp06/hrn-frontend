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
  return <div className={classes.pageWrapper}>{children}</div>
}

export default MarginLeftAppWrapper
