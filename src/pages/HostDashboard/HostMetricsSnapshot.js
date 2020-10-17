import React from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { BarChart, Bar, ResponsiveContainer } from 'recharts'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  totalSnapshotGrid: {
    padding: theme.spacing(5),
    width: '100%',
    height: '575px',
    [theme.breakpoints.down('md')]: {
      height: 'auto',
    },
  },
  snapshotGraphContainer: {
    height: '100%',
    [theme.breakpoints.down('md')]: {
      height: '250px',
      marginBottom: '20px',
    },
  },
  totalMetricsContainer: {
    height: '100%',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      flexDirection: 'row',
    },
  },
  metricContainer: {
    height: '30%',
    width: '90%',
    [theme.breakpoints.down('md')]: {
      width: '30%',
      height: '90%',
    },
  },
  metricHeader: {
    marginBottom: 0,
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      width: '70%',
      fontSize: '1.5rem',
      margin: theme.spacing(0, 'auto'),
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1rem',
    },
  },
  metricNumber: {
    ...theme.typography.largeNumber,
    color: theme.palette.common.ghostWhite,
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      fontSize: '2.5rem',
    },
  },
  purpleText: {
    color: theme.palette.common.lightPurple,
  },
  pinkText: {
    color: theme.palette.common.basePink,
  },
  yellowText: {
    color: theme.palette.common.sunray,
  },
}))

const HostMetricsSnapshot = ({ totalMetrics }) => {
  const { allTimeRSVPed, allTimeMutualThumbs, avgThumbsPerEvent } = totalMetrics[0]
  const classes = useStyles()
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
