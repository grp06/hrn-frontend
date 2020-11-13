import React from 'react'

import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { constants } from '../../utils'

const { drawerWidth } = constants
const containerWidth = window.screen.width - drawerWidth
const useStyles = makeStyles((theme) => ({
  container: {
    position: 'fixed',
    zIndex: 999,
    bottom: 'auto',
    width: containerWidth,
    height: 'auto',
    top: '0',
    backgroundColor: 'rgb(36,37,38,0.7)',
    padding: theme.spacing(2),
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    top: 'auto',
  },
  textContainer: {
    width: 'auto',
    // backgroundColor: 'rgba(0,0,0,0.85)',
    textAlign: 'center',
  },
  yellowText: {
    color: theme.palette.common.sunray,
  },
}))

const JoinEventBanner = () => {
  const classes = useStyles()
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.container}
    >
      <Grid item className={classes.textContainer}>
        <Typography variant="h3">The Event Has Started!</Typography>
        <Typography variant="body1" className={classes.yellowText}>
          Click &apos;Join Event&apos; below to join
        </Typography>
      </Grid>
      <div className={classes.root}>
        <LinearProgress />
      </div>
    </Grid>
  )
}

export default JoinEventBanner
