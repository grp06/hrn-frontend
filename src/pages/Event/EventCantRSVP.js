import React from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { FloatCardLarge } from '../../common'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  topDashboard: {
    width: '100%',
    paddingTop: '40px',
    paddingBottom: '40px',
    borderStyle: 'none none solid',
    borderWidth: '1px',
    borderColor: theme.palette.common.greyBorder,
    borderRadius: '4px 4px 0px 0px',
    backgroundColor: theme.palette.common.greyHighlight,
  },
}))

const EventCantRSVP = () => {
  const classes = useStyles()
  return (
    <FloatCardLarge>
      <Grid
        item
        container
        justify="space-around"
        alignItems="center"
        className={classes.topDashboard}
      >
        <Typography variant="h1">Sorry, this event is over.</Typography>
      </Grid>
    </FloatCardLarge>
  )
}

export default EventCantRSVP
