//@ts-nocheck
import React, { useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import { CSVLink } from 'react-csv'
import {
  Grid,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useHRNAnalyticsStyles } from '../HRNAnalytics'
import { getEventAnalytics, formatDate } from '../../utils'
import { EventObjectInterface } from '../../utils'

interface HostEventExpansionPanelProps {
  event: EventObjectInterface
}

const HostEventExpansionPanel: React.FC<HostEventExpansionPanelProps> = ({ event }) => {
  const { id } = event
  const classes = useHRNAnalyticsStyles()
  const [eventPanelExpanded, setEventPanelExpanded] = useState(null)

  const handlePanelPress = (panel) => (event, isExpanded) => {
    setEventPanelExpanded(isExpanded ? panel : false)
  }

  const renderExpansionPanelWithData = (event) => {
    const { event_users } = event
    const {
      attendanceRateForEvent,
      attendeesCSVofEvent,
      RSVPsCSVofEvent,
      numberOfDropOffsInEvent,
      numberOfEventParticipants,
      numberOfMutualThumbsInEvent,
      numberOfTotalRoundsInEvent,
      relevancyOfEvent,
      roundLengthOfEvent,
    } = getEventAnalytics(event)
    return (
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <CSVLink
            data={RSVPsCSVofEvent.data}
            headers={RSVPsCSVofEvent.headers}
            className={classes.downloadButton}
          >
            Dowload list of all RSVPs
            <FeatherIcon icon="download" stroke="#fff" size="20" />
          </CSVLink>
          <CSVLink
            data={attendeesCSVofEvent.data}
            headers={attendeesCSVofEvent.headers}
            className={classes.downloadButton}
          >
            Dowload list of all attendees
            <FeatherIcon icon="download" stroke="#fff" size="20" />
          </CSVLink>
        </Grid>
        <Grid container justify="center" alignItems="center">
          <Grid container justify="flex-start">
            <Typography variant="h4" className={classes.expansionPanelSectionHeading}>
              Event Information:
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.expansionPanelDetailsHeading}>
              Event ID: {event.id}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.expansionPanelDetailsHeading}>
              Total RSVPs: {event_users.length}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.expansionPanelDetailsHeading}>
              Total Participants: {numberOfEventParticipants}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.expansionPanelDetailsHeading}>
              Attendance Rate: {attendanceRateForEvent} %
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.expansionPanelDetailsHeading}>
              Total Number of Mutual Connections: {numberOfMutualThumbsInEvent}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.expansionPanelDetailsHeading}>
              Drop Offs:
              {numberOfDropOffsInEvent}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.expansionPanelDetailsHeading}>
              Total Number of Rounds: {numberOfTotalRoundsInEvent}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.expansionPanelDetailsHeading}>
              Length of Rounds: {roundLengthOfEvent} mins
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.expansionPanelDetailsHeading}>
              Relevancy of event: {relevancyOfEvent} %
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <ExpansionPanel key={id} expanded={eventPanelExpanded === id} onChange={handlePanelPress(id)}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon style={{ color: '#f4f6fa' }} />}
        aria-controls={`${id}-content`}
        id={`${id}-header`}
      >
        <Typography variant="h3" className={classes.eventPanelHeading}>
          {event.event_name}
        </Typography>
        <Typography variant="h6">{formatDate(new Date(event.start_at).getTime())}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {event.status === 'complete' ? (
          renderExpansionPanelWithData(event)
        ) : (
          <Grid container justify="center" alignItems="center">
            <Grid container justify="center" alignItems="center">
              <Typography
                variant="subtitle1"
                className={classes.expansionPanelDetailsHeading}
                style={{ fontSize: '1.25rem', textAlign: 'center' }}
              >
                This event has not started. Come back when it is over and we&rsquo;ll have some
                stats for you!{' '}
                <span role="img" aria-label="thumbs up">
                  👍
                </span>
              </Typography>
            </Grid>
            <Grid container justify="center" alignItems="center">
              <a
                className={classes.aTag}
                href={`https://launch.hirightnow.co/events/${event.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '1.25rem', textAlign: 'center' }}
              >
                Show me the way to the event page{' '}
                <span role="img" aria-label="blind emojii">
                  🦮👨‍🦯
                </span>
              </a>
            </Grid>
          </Grid>
        )}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default HostEventExpansionPanel
