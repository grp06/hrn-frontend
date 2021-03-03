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

import { useHostDashboardStyles } from '.'
import { getEventAnalytics, formatDate } from '../../utils'

const HostEventsExpansionPanel = ({ eventsAndRoundsData, eventsAndPartnersData }) => {
  const classes = useHostDashboardStyles()

  const [sortedEvents, setSortedEvents] = useState(null)

  const [eventPanelExpanded, setEventPanelExpanded] = useState(null)
  const handlePanelPress = (panel) => (event, isExpanded) => {
    setEventPanelExpanded(isExpanded ? panel : false)
  }

  useEffect(() => {
    const sorted = eventsAndPartnersData.events.sort((a, b) => {
      return new Date(b.start_at).getTime() - new Date(a.start_at).getTime()
    })
    setSortedEvents(sorted)
    setEventPanelExpanded(sorted[0].id)
  }, [eventsAndPartnersData])

  if (!eventsAndPartnersData) {
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
    const { event_users } = event
    const {
      numberOfMutualThumbsInEvent,
      numberOfDropOffsInEvent,
      RSVPsCSVofEvent,
      attendeesCSVofEvent,
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
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.detailsHeading}>
              Total RSVPs: {event_users.length}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.detailsHeading}>
              Mutual Connections: {numberOfMutualThumbsInEvent}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.detailsHeading}>
              Drop Offs: {numberOfDropOffsInEvent}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.detailsHeading}>
              Total Attendees: {attendeesCSVofEvent.data.length}
            </Typography>
          </Grid>
          <Grid container justify="center" alignItems="center">
            <a
              className={classes.aTag}
              href={`https://launch.hirightnow.co/events/${event.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Take me to the event page{' '}
              <span role="img" aria-label="man running">
                🏃‍♂️
              </span>
            </a>
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
      <ExpansionPanel
        key={id}
        expanded={eventPanelExpanded === id}
        onChange={handlePanelPress(id)}
        className={classes.expansionPanel}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon style={{ color: '#f4f6fa' }} />}
          aria-controls={`${id}-content`}
          id={`${id}-header`}
        >
          <Grid container direction="row" alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h3" className={classes.eventPanelHeading}>
                {event.event_name}
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6">{startTime}</Typography>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {event.status === 'complete' ? (
            renderExpansionPanelWithData(event)
          ) : (
            <Grid container justify="center" alignItems="center">
              <Grid item md={6} xs={12}>
                <Typography variant="subtitle1" className={classes.detailsHeading}>
                  This event has not started. Come back when it is over and we&rsquo;ll have some
                  stats for you!{' '}
                  <span role="img" aria-label="thumbs up">
                    👍
                  </span>
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
