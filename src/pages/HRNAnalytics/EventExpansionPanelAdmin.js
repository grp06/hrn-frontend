import React, { useState, useEffect } from 'react'

import Grid from '@material-ui/core/Grid'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'
import FeatherIcon from 'feather-icons-react'
import { CSVLink } from 'react-csv'
import { makeStyles } from '@material-ui/styles'

import formatDate from '../../utils/formatDate'
import { getEventAnalytics } from '../../utils'

const useStyles = makeStyles((theme) => ({
  eventPanelHeading: {
    flexBasis: '33.33%',
    flexShrink: 0,
    marginBottom: 0,
    color: theme.palette.common.ghostWhite,
  },
  detailsHeading: {
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  downloadButton: {
    backgroundColor: theme.palette.common.basePurple,
    color: theme.palette.common.ghostWhite,
    padding: '8px 20px',
    margin: `0 8px 8px 8px`,
    textDecoration: 'none',
    fontFamily: 'Muli',
    borderRadius: 4,
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    textAlign: 'center',
    '& svg': {
      marginLeft: theme.spacing(1),
    },
  },
  downloadAttendees: {
    backgroundColor: theme.palette.common.basePurple,
    color: theme.palette.common.ghostWhite,
    padding: theme.spacing(1, 2.5),
    margin: theme.spacing(0, 1, 1, 1),
    textDecoration: 'none',
    fontFamily: 'Muli',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    '& svg': {
      marginLeft: theme.spacing(1),
    },
  },
}))

const EventExpansionPanelAdmin = ({ eventsAndRoundsData }) => {
  const classes = useStyles()

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
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.detailsHeading}>
              Total RSVPs: {event_users.length}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.detailsHeading}>
              Total Participants: {numberOfEventParticipants}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.detailsHeading}>
              Attendance Rate: {attendanceRateForEvent} %
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.detailsHeading}>
              Total Number of Mutual Connections: {numberOfMutualThumbsInEvent}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.detailsHeading}>
              Drop Offs:
              {numberOfDropOffsInEvent}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.detailsHeading}>
              Total Number of Rounds: {numberOfTotalRoundsInEvent}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.detailsHeading}>
              Length of Rounds: {roundLengthOfEvent} mins
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle1" className={classes.detailsHeading}>
              Relevancy of event: {relevancyOfEvent} %
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

export default EventExpansionPanelAdmin
