import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'fixed',
    zIndex: 998,
    left: 'auto',
    right: '0%',
    top: '0%',
    height: '100vh',
    width: '350px',
    backgroundColor: theme.palette.common.greyCard,
    overflowY: 'scroll',
  },
}))

const MiniContactCardSidebar = () => {
  const classes = useStyles()
  return <Grid container direction="column" className={classes.container} />
}

export default MiniContactCardSidebar
