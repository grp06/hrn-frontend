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
import Button from '@material-ui/core/Button'
import FeatherIcon from 'feather-icons-react'
import { CSVDownload } from 'react-csv'

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
    margin: `0 ${theme.spacing(1)}px ${theme.spacing(1)}px ${theme.spacing(1)}px`,
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
    const { mutualThumbsInEvent, dropOffsInEvent, totalAttendeesInEvent } = getHostEventAnalytics(
      event
    )

    const csvData = [
      ['firstname', 'lastname', 'email'],
      ['Ahmed', 'Tomi', 'ah@smthing.co.com'],
      ['Raed', 'Labes', 'rl@smthing.co.com'],
      ['Yezzi', 'Min l3b', 'ymin@cocococo.com'],
    ]
    return (
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Button variant="contained" color="primary" className={classes.downloadButton}>
            Dowload list of all RSVPs
            <FeatherIcon icon="download" stroke="#e98dd7" size="24" />
          </Button>

          <Button variant="contained" color="secondary" className={classes.downloadButton}>
            Dowload list of all attendees
            <FeatherIcon icon="download" stroke="#6327bb" size="24" />
          </Button>
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
            <Typography className={classes.detailsHeading}>Drop Offs: {dropOffsInEvent}</Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography className={classes.detailsHeading}>
              Total Attendees: {totalAttendeesInEvent}
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
