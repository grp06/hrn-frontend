import React, { useState, useEffect } from 'react'
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
import { useHRNAnalyticsStyles } from '.'
import { getEventAnalytics, formatDate } from '../../utils'

const EventExpansionPanelAdmin = ({ eventsAndRoundsData }) => {
  const classes = useHRNAnalyticsStyles()
  const [sortedEvents, setSortedEvents] = useState(null)
  const [eventPanelExpanded, setEventPanelExpanded] = useState(null)

  const handlePanelPress = (panel) => (event, isExpanded) => {
    setEventPanelExpanded(isExpanded ? panel : false)
  }

  useEffect(() => {
    const sorted = eventsAndRoundsData.events.sort((a, b) => {
      return new Date(b.start_at).getTime() - new Date(a.start_at).getTime()
    })
    setSortedEvents(sorted)
    setEventPanelExpanded(sorted[0].id)
  }, [eventsAndRoundsData])

  if (!eventsAndRoundsData) {
    return (
      <div>
        No events to see here{' '}
        <span role="img" aria-label="umbrella beach">
          🏖
        </span>
      </div>
    )
  }

  const renderExpansionPanelWithData = (event) => {
    const { event_users, host: hostObject } = event
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
        <Grid container justify="center" alignItems="center">
          <Grid container justify="flex-start">
            <Typography variant="h4" className={classes.expansionPanelSectionHeading}>
              Host Information:
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.expansionPanelDetailsHeading}>
              User ID: {hostObject.id}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.expansionPanelDetailsHeading}>
              Name: {hostObject.first_name}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.expansionPanelDetailsHeading}>
              Email: {hostObject.email}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.expansionPanelDetailsHeading}>
              City: {hostObject.city}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.expansionPanelDetailsHeading}>
              Linked In:{' '}
              {hostObject.linkedIn_url ? (
                <a
                  className={classes.aTag}
                  href={
                    hostObject.linkedIn_url.includes('http')
                      ? hostObject.linkedIn_url
                      : `https://${hostObject.linkedIn_url}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  profile
                </a>
              ) : (
                'N/A'
              )}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  if (!sortedEvents) {
    return null
  }

  return sortedEvents.map((event) => {
    const { id } = event

    const startTime = formatDate(new Date(event.start_at).getTime())

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
          <Typography variant="h6">{startTime}</Typography>
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
  })
}

export default EventExpansionPanelAdmin
