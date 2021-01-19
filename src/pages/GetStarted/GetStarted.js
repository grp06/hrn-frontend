import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { useAppContext, useUserContext } from '../../context'

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    marginTop: theme.spacing(10),
  },
  formHeader: {
    textAlign: 'center',
  },
}))

const GetStarted = () => {
  const classes = useStyles()

  useEffect(() => {
    window.analytics.page('/get-started')
  }, [])

  return (
    <Grid
      container
      className={classes.pageContainer}
      alignItems="flex-start"
      justify="space-around"
    >
      <Grid item>
        <Typography variant="h2" className={classes.getStartedHeader}>
          Get Started
        </Typography>
      </Grid>
    </Grid>
  )
}

export default GetStarted
