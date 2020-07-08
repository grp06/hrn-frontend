import React, { useState } from 'react'

import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { getHostEventAnalytics } from '../helpers'
import formatDate from '../utils/formatDate'

const useStyles = makeStyles((theme) => ({
  eventPanelHeading: {
    ...theme.typography.h3,
    fontWeight: '300',
    color: theme.palette.common.ghostWhite,
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    color: theme.palette.common.ghostWhiteSub,
  },
  detailsHeading: {
    marginBottom: '15px',
    textAlign: 'center',
  },
}))

const HostEventsExpansionPanel = ({ eventsAndRoundsData }) => {
  const classes = useStyles()
  const [eventPanelExpanded, setEventPanelExpanded] = useState(
    eventsAndRoundsData.events[0].id || false
  )

  const handlePanelPress = (panel) => (event, isExpanded) => {
    setEventPanelExpanded(isExpanded ? panel : false)
  }
  if (!eventsAndRoundsData) {
    return <div>You've got no events 🏖</div>
  }

  return eventsAndRoundsData.events.map((event, index) => {
    const { id, event_users } = event
    const { mutualThumbsInEvent, dropOffsInEvent, totalAttendeesInEvent } = getHostEventAnalytics(
      event
    )
    const startTime = formatDate(new Date(event.start_at).getTime())

    return (
      <ExpansionPanel expanded={eventPanelExpanded === id} onChange={handlePanelPress(id)}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon style={{ color: '#f4f6fa' }} />}
          aria-controls={`${id}-content`}
          id={`${id}-header`}
        >
          <Typography className={classes.eventPanelHeading}>{event.event_name}</Typography>
          <Typography className={classes.secondaryHeading}>{startTime}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {event.status === 'complete' ? (
            <Grid container justify="center" alignItems="center">
              <Grid item md={6} xs={12}>
                <Typography className={classes.detailsHeading}>
                  People Registered: {event_users.length}
                </Typography>
              </Grid>
              <Grid item md={6} xs={12}>
                <Typography className={classes.detailsHeading}>
                  Mutual Connections: {mutualThumbsInEvent}
                </Typography>
              </Grid>
              <Grid item md={6} xs={12}>
                <Typography className={classes.detailsHeading}>
                  Drop Offs: {dropOffsInEvent}
                </Typography>
              </Grid>
              <Grid item md={6} xs={12}>
                <Typography className={classes.detailsHeading}>
                  Total Attendees: {totalAttendeesInEvent}
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Grid container justify="center" alignItems="center">
              <Grid item md={6} xs={12}>
                <Typography className={classes.detailsHeading}>
                  This event has not started. Come back when it is over and we'll have some stats
                  for you! 👍
                </Typography>
              </Grid>
            </Grid>
          )}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  })
}

export default HostEventsExpansionPanel
