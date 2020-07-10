import React, { useState } from 'react'

import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Button from '@material-ui/core/Button'
import FeatherIcon from 'feather-icons-react'
import { CSVLink } from 'react-csv'
import formatDate from '../utils/formatDate'
import { getHostEventAnalytics } from '../helpers'

const useStyles = makeStyles((theme) => ({
  eventPanelHeading: {
    ...theme.typography.h3,
    fontWeight: '300',
    color: theme.palette.common.ghostWhite,
    flexBasis: '33.33%',
    flexShrink: 0,
    marginBottom: 0,
  },
  secondaryHeading: {
    color: theme.palette.common.ghostWhiteSub,
  },
  detailsHeading: {
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  downloadButton: {
    backgroundColor: theme.palette.common.dankPurp,
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
    backgroundColor: theme.palette.common.dankPurp,
    color: theme.palette.common.ghostWhite,
    padding: '8px 20px',
    margin: `0 8px 8px 8px`,
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

const HostEventsExpansionPanel = ({ eventsAndRoundsData }) => {
  const classes = useStyles()
  const [eventPanelExpanded, setEventPanelExpanded] = useState(
    eventsAndRoundsData.events[0].id || false
  )

  const handlePanelPress = (panel) => (event, isExpanded) => {
    setEventPanelExpanded(isExpanded ? panel : false)
  }

  if (!eventsAndRoundsData) {
    return <div>No events to see here 🏖</div>
  }

  const renderExpansionPanelWithData = (event) => {
    const { event_users } = event
    const {
      mutualThumbsInEvent,
      dropOffsInEvent,
      getRSVPs,
      getAttendeesCSV,
    } = getHostEventAnalytics(event)

    return (
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <CSVLink
            data={getRSVPs.data}
            headers={getRSVPs.headers}
            className={classes.downloadButton}
          >
            Dowload list of all RSVPs
            <FeatherIcon icon="download" stroke="#fff" size="20" />
          </CSVLink>
          <CSVLink
            data={getAttendeesCSV.data}
            headers={getAttendeesCSV.headers}
            className={classes.downloadButton}
          >
            Dowload list of all attendees
            <FeatherIcon icon="download" stroke="#fff" size="20" />
          </CSVLink>
        </Grid>
        <Grid container justify="center" alignItems="center">
          <Grid item md={6} xs={12}>
            <Typography className={classes.detailsHeading}>
              Total RSVPs: {event_users.length}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography className={classes.detailsHeading}>
              Mutual Connections: {mutualThumbsInEvent}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography className={classes.detailsHeading}>
              Drop Offs:
              {dropOffsInEvent}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography className={classes.detailsHeading}>
              Total Attendees: {getAttendeesCSV.data.length}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return eventsAndRoundsData.events.map((event) => {
    const { id } = event

    const startTime = formatDate(new Date(event.start_at).getTime())

    return (
      <ExpansionPanel key={id} expanded={eventPanelExpanded === id} onChange={handlePanelPress(id)}>
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
            renderExpansionPanelWithData(event)
          ) : (
            <Grid container justify="center" alignItems="center">
              <Grid item md={6} xs={12}>
                <Typography className={classes.detailsHeading}>
                  This event has not started. Come back when it is over and we&rsquo;ll have some
                  stats for you! 👍
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
