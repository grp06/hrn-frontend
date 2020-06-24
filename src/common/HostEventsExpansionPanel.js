import React, { useState } from 'react'

import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { getHostEventAnalytics } from '../helpers'

const useStyles = makeStyles((theme) => ({
  sectionHeader: {
    ...theme.typography.h2,
    color: theme.palette.common.ghostWhite,
    marginBottom: '25px',
  },
  eventPanelHeading: {
    ...theme.typography.h3,
    fontWeight: '300',
    color: theme.palette.common.ghostWhite,
  },
}))

const HostEventsExpansionPanel = ({ eventsAndRoundsData }) => {
  const classes = useStyles()
  const [eventPanelExpanded, setEventPanelExpanded] = useState(false)

  const handlePanelPress = (panel) => (event, isExpanded) => {
    setEventPanelExpanded(isExpanded ? panel : false)
  }
  if (!eventsAndRoundsData) {
    return <div>You've got no events 🏖</div>
  }

  return eventsAndRoundsData.events.map((event) => {
    const { id, event_users } = event
    const { mutualThumbsInEvent, dropOffsInEvent, totalAttendeesInEvent } = getHostEventAnalytics(
      event
    )
    // console.log('dropOffsInEvent -> ', dropOffsInEvent)
    return (
      <ExpansionPanel expanded={eventPanelExpanded === id} onChange={handlePanelPress(id)}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon style={{ color: '#f4f6fa' }} />}
          aria-controls={`${id}-content`}
          id={`${id}-header`}
        >
          <Typography className={classes.eventPanelHeading}>{event.event_name}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container>
            <Grid item md={6} xs={12}>
              <Typography>Total Registered: {event_users.length}</Typography>
            </Grid>
            <Grid item md={6} xs={12}>
              <Typography>Total Mutual Connections: {mutualThumbsInEvent}</Typography>
            </Grid>
            <Grid item md={6} xs={12}>
              <Typography>Total Drop Offs: {dropOffsInEvent}</Typography>
            </Grid>
            <Grid item md={6} xs={12}>
              <Typography>Total Attendees: {totalAttendeesInEvent}</Typography>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  })
}

export default HostEventsExpansionPanel
