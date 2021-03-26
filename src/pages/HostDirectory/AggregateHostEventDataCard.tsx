import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { useHostDirectoryStyles } from '.'
import { getAggregateEventAnalytics, EventObjectInterface } from '../../utils'

export interface AggregateHostEventDataCardProps {
  becameHostAt: string
  events: EventObjectInterface[]
}

const AggregateHostEventDataCard: React.FC<AggregateHostEventDataCardProps> = ({
  becameHostAt,
  events,
}) => {
  const classes = useHostDirectoryStyles()

  const {
    averageAttendanceRate,
    averageRSVPs,
    totalNumberOfConnections,
    averageNumberOfConnections,
  } = getAggregateEventAnalytics(events)

  const getDaysAsAHost = () => {
    return Math.round(
      (new Date().getTime() - new Date(becameHostAt).getTime()) / (1000 * 3600 * 24)
    )
  }

  const getFrequencyOfEvents = () => {
    const daysAsAHost = getDaysAsAHost()
    return (daysAsAHost / events.length).toFixed(2)
  }

  return (
    <Grid container direction="row" className={classes.aggregateHostEventDataCard}>
      <Grid item md={6} xs={12}>
        <Typography variant="subtitle1" className={classes.detailsHeading}>
          Days as a Host: {getDaysAsAHost()} days
        </Typography>
      </Grid>
      <Grid item md={6} xs={12}>
        <Typography variant="subtitle1" className={classes.detailsHeading}>
          Total Events Hosted: {events.length}
        </Typography>
      </Grid>
      <Grid item md={6} xs={12}>
        <Typography variant="subtitle1" className={classes.detailsHeading}>
          Frequency of Events: every {getFrequencyOfEvents()} days
        </Typography>
      </Grid>
      <Grid item md={6} xs={12}>
        <Typography variant="subtitle1" className={classes.detailsHeading}>
          Average Attendance Rate: {averageAttendanceRate} %
        </Typography>
      </Grid>
      <Grid item md={6} xs={12}>
        <Typography variant="subtitle1" className={classes.detailsHeading}>
          Average Number of RSVPs: {averageRSVPs}
        </Typography>
      </Grid>
      <Grid item md={6} xs={12}>
        <Typography variant="subtitle1" className={classes.detailsHeading}>
          Total Number of Connections: {totalNumberOfConnections}
        </Typography>
      </Grid>
      <Grid item md={6} xs={12}>
        <Typography variant="subtitle1" className={classes.detailsHeading}>
          Average Number of Connections: {averageNumberOfConnections}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default AggregateHostEventDataCard
