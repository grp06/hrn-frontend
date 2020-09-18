import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FeatherIcon from 'feather-icons-react'
import { makeStyles } from '@material-ui/styles'
import { getBroadcastBoxElement, formatDate } from '../../utils'
import { EventBreakdownStepper } from '../Event'
import { PreEvent } from '../PreEvent'

const useStyles = makeStyles((theme) => ({
  bannerGradient: {
    background:
      'linear-gradient(0deg, rgba(25,25,25,1) 0%, rgba(0,0,0,0) 58%, rgba(0,212,255,0) 100%)',
    width: '100%',
    height: '100%',
  },
  boxContainer: {
    width: '100%',
    height: '84vh',
  },
  eventBreakdownContainer: {
    width: '100%',
    borderRadius: '4px',
    height: 'auto',
    marginRight: 'auto',
    border: '2px solid #3e4042',
    boxShadow: '5px 5px 0 #3e4042',
    backgroundColor: theme.palette.common.greyCard,
  },
}))

const BroadcastBox = React.memo(({ event, userEventStatus }) => {
  const classes = useStyles()
  const { start_at, description, event_name, host_id, status: eventStatus } = event

  const renderBroadcastBoxContent = () => {
    switch (eventStatus) {
      case 'not-started':
        return (
          <Grid container justify="flex-end" direction="column" className={classes.bannerGradient}>
            <Grid container direction="column">
              <Grid item container direction="column" justify="flex-start" md={12} xs={12}>
                <Typography variant="h3">{event_name}</Typography>
                <Grid item container direction="row" alignItems="center">
                  <FeatherIcon icon="calendar" stroke="#e98dd7" size="24" />
                  <Typography variant="subtitle1" className={classes.subtitle}>
                    {formatDate(start_at)}
                  </Typography>
                </Grid>
                <Grid item container direction="row" alignItems="center">
                  <Typography variant="subtitle1" className={classes.subtitle}>
                    {description}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <div className={classes.eventBreakdownContainer}>
              <EventBreakdownStepper endMessage="You are all set, sit back and wait for the host to start the event!" />
            </div>
          </Grid>
        )
      case 'pre-event':
        return <PreEvent />
      default:
        return getBroadcastBoxElement(userEventStatus)
    }
  }

  return <div className={classes.boxContainer}>{renderBroadcastBoxContent()}</div>
})

export default BroadcastBox
