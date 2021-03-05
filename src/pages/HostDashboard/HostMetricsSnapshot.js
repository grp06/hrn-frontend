import React from 'react'

import { Grid, Typography } from '@material-ui/core'
import { BarChart, Bar, ResponsiveContainer } from 'recharts'
import { useHostDashboardStyles } from '.'

const HostMetricsSnapshot = ({ totalMetrics }) => {
  const { allTimeRSVPed, allTimeMutualThumbs, avgThumbsPerEvent } = totalMetrics[0]
  const classes = useHostDashboardStyles()
  return (
    <Grid
      container
      alignItems="center"
      justify="space-around"
      className={classes.totalSnapshotGrid}
    >
      <Grid item lg={6} md={12} className={classes.snapshotGraphContainer}>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={totalMetrics}>
            <Bar dataKey="allTimeRSVPed" fill="#723EBD" animationDuration={1200} />
            <Bar dataKey="allTimeMutualThumbs" fill="#df97d1" animationDuration={1200} />
            <Bar dataKey="avgThumbsPerEvent" fill="#edb868" animationDuration={1200} />
          </BarChart>
        </ResponsiveContainer>
      </Grid>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        justify="space-between"
        className={classes.totalMetricsContainer}
        lg={3}
        md={12}
      >
        <Grid item className={classes.metricContainer}>
          <Typography variant="h2" className={`${classes.metricHeader} ${classes.purpleText}`}>
            Total Participants RSVPed
          </Typography>
          <Typography className={classes.metricNumber}>{allTimeRSVPed}</Typography>
        </Grid>
        <Grid item className={classes.metricContainer}>
          <Typography variant="h2" className={`${classes.metricHeader} ${classes.pinkText}`}>
            Total Connections Fostered
          </Typography>
          <Typography className={classes.metricNumber}>{allTimeMutualThumbs}</Typography>
        </Grid>
        <Grid item className={classes.metricContainer}>
          <Typography variant="h2" className={`${classes.metricHeader} ${classes.yellowText}`}>
            Avg. Connections per Event
          </Typography>
          <Typography className={classes.metricNumber}>{avgThumbsPerEvent}</Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default HostMetricsSnapshot
