import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FeatherIcon from 'feather-icons-react'
import EditIcon from '@material-ui/icons/Edit'
import { makeStyles } from '@material-ui/styles'
import { getBroadcastBoxElement, formatDate } from '../../utils'
import { EventBreakdownStepper } from '../Event'
import { PreEvent } from '../PreEvent'
import { EventForm, TransitionModal } from '../../common'

// the padding right and boxSizing in boxContainer is to help hide scrollbar
const useStyles = makeStyles((theme) => ({
  boxContainer: {
    width: '100%',
    height: '100%',
    maxHeight: '80vh',
    overflowY: 'scroll',
    overflowX: 'hidden',
    position: 'absolute',
    paddingRight: theme.spacing(2),
    boxSizing: 'content-box',
    bottom: 'auto',
  },
  eventBreakdownContainer: {
    width: '99%',
    borderRadius: '4px',
    height: 'auto',
    marginRight: 'auto',
    border: '2px solid #3e4042',
    boxShadow: '5px 5px 0 #3e4042',
    backgroundColor: theme.palette.common.greyCard,
    marginBottom: theme.spacing(2.5),
  },
  eventInfoContainer: {
    paddingTop: '200px',
  },
  eventName: {
    fontSize: '4.5rem',
    letterSpacing: '0.1rem',
    marginBottom: theme.spacing(1.5),
  },
  hostName: {
    fontSize: '1.25rem',
    lineHeight: 1.7,
  },
  hostNameAndEventUsersContainer: {
    margin: theme.spacing(1.5, 0),
    width: '75%',
  },
  pinkNumber: {
    color: theme.palette.common.orchid,
    fontSize: '2rem',
    lineHeight: 1,
  },
  subtitle: {
    color: '#BFBFBF',
  },
}))

const BroadcastBox = React.memo(
  ({ event, isEventHost, onlineEventUsers, setUserEventStatus, userEventStatus }) => {
    const classes = useStyles()
    const { start_at, description, event_name, status: eventStatus, host, event_users } = event

    const editFormModal = TransitionModal({
      modalBody: <EventForm eventData={event} />,
      iconButton: {
        iconButtonIcon: <EditIcon style={{ color: '#f4f6fa', fontSize: '32px' }} />,
      },
    })

    const renderBroadcastBoxContent = () => {
      switch (eventStatus) {
        case 'not-started':
          return (
            <Grid container justify="flex-end" direction="column" wrap="nowrap">
              <Grid container direction="column" className={classes.eventInfoContainer}>
                <Grid item container direction="column" justify="flex-start" md={12} xs={12}>
                  <Grid container justify="flex-start" alignItems="center">
                    <Typography variant="h3" className={classes.eventName}>
                      {event_name}
                    </Typography>
                    {isEventHost && editFormModal}
                  </Grid>
                  <Grid item container direction="row" alignItems="center">
                    <FeatherIcon icon="calendar" stroke="#e98dd7" size="24" />
                    <Typography variant="subtitle1" style={{ paddingLeft: '8px' }}>
                      {formatDate(start_at)}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                    className={classes.hostNameAndEventUsersContainer}
                    style={{ width: '75%' }}
                  >
                    <Grid
                      container
                      item
                      direction="column"
                      justify="center"
                      alignItems="flex-start"
                      xs={4}
                    >
                      <Typography variant="subtitle1" className={classes.subtitle}>
                        Hosted By /
                      </Typography>
                      <Typography variant="h6" className={classes.hostName}>
                        {host && host.name}
                      </Typography>
                    </Grid>
                    <Grid
                      container
                      item
                      direction="column"
                      justify="center"
                      alignItems="flex-start"
                      xs={4}
                    >
                      <Typography variant="subtitle1" className={classes.subtitle}>
                        RSVP'ed /
                      </Typography>
                      <Typography variant="h6" className={classes.pinkNumber}>
                        {event_users.length}
                      </Typography>
                    </Grid>
                    <Grid
                      container
                      item
                      direction="column"
                      justify="center"
                      alignItems="flex-start"
                      xs={4}
                    >
                      <Typography variant="subtitle1" className={classes.subtitle}>
                        Online /
                      </Typography>
                      <Typography variant="h6" className={classes.pinkNumber}>
                        {onlineEventUsers && onlineEventUsers.online_event_users
                          ? onlineEventUsers.online_event_users.length
                          : '--'}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    item
                    direction="row"
                    alignItems="center"
                    style={{ marginBottom: '24px' }}
                  >
                    <Typography variant="subtitle1">{description}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <div className={classes.eventBreakdownContainer}>
                <EventBreakdownStepper endMessage="You are all set, sit back and wait for the host to start the event!" />
              </div>
            </Grid>
          )
        case 'pre-event':
          return <PreEvent onlineEventUsers={onlineEventUsers} />
        case 'room-in-progress':
          return getBroadcastBoxElement(setUserEventStatus, userEventStatus)
        case 'in-between-rounds':
          return getBroadcastBoxElement(setUserEventStatus, userEventStatus)
        default:
          return null
      }
    }

    return <div className={classes.boxContainer}>{renderBroadcastBoxContent()}</div>
  }
)

export default BroadcastBox
