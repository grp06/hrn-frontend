import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import logo from '../../assets/HRNlogoNoFrame.svg'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarContainer: {
    width: '70px',
    height: '70px',
  },
  cardContainer: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: 'auto',
    padding: theme.spacing(3, 5),
    marginBottom: theme.spacing(3),
  },
  hostAndRSVPContainer: {
    marginBottom: theme.spacing(2),
  },
  hostContainer: {
    height: '70px',
  },
  hostNameAndTitleContainer: {
    width: 'auto',
    height: '100%',
    marginLeft: theme.spacing(2),
    padding: theme.spacing(0.5, 0),
  },
  hostName: {
    margin: '0',
  },
  largeNumber: {
    ...theme.typography.largeNumber,
  },
  rsvpedNumberContainer: {
    width: 'auto',
  },
  onlineAttendeesNumberContainer: {
    width: 'auto',
    marginLeft: theme.spacing(8),
  },
  subtitle: {
    marginBottom: theme.spacing(1),
  },
}))

const HostAndEventDescCard = React.memo(({ event, showOnlineAttendees, userIsHost }) => {
  const classes = useStyles()
  const { description: eventDescription, event_users, host } = event
  const { name: hostName, profile_pic_url } = host

  return (
    <Grid container direction="column" className={classes.cardContainer}>
      <Grid
        container
        direction="row"
        justify="space-between"
        className={classes.hostAndRSVPContainer}
      >
        <Grid container item direction="column" xs={12} md={6}>
          <Typography variant="subtitle1" className={classes.subtitle}>
            Hosted By /
          </Typography>
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="flex-start"
            className={classes.hostContainer}
          >
            <Avatar className={classes.avatarContainer}>
              <img alt="company-logo" className={classes.avatar} src={profile_pic_url || logo} />
            </Avatar>
            <Grid
              container
              direction="column"
              justify="center"
              wrap="nowrap"
              className={classes.hostNameAndTitleContainer}
            >
              <Typography variant="h3" className={classes.hostName}>
                {hostName}
              </Typography>
              {/* <Typography variant="subtitle1">European Gigaloo</Typography> */}
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={6} direction="row" justify="flex-end">
          {userIsHost || (!userIsHost && event_users.length > 9) ? (
            <Grid
              container
              direction="column"
              justify="space-between"
              alignItems="center"
              className={classes.rsvpedNumberContainer}
            >
              <Typography variant="subtitle1" className={classes.subtitle}>
                RSVP&apos;ed /
              </Typography>
              <Typography className={classes.largeNumber}>{event_users.length}</Typography>
            </Grid>
          ) : null}
          {showOnlineAttendees && userIsHost ? (
            <Grid
              container
              direction="column"
              justify="space-between"
              alignItems="center"
              className={classes.onlineAttendeesNumberContainer}
            >
              <Typography variant="subtitle1" className={classes.subtitle}>
                Online Now /
              </Typography>
              <Typography className={classes.largeNumber}>{showOnlineAttendees}</Typography>
            </Grid>
          ) : null}
        </Grid>
      </Grid>
      <Grid container item direction="row" justify="flex-start" md={11}>
        <Typography variant="body1">{eventDescription}</Typography>
      </Grid>
    </Grid>
  )
})

export default HostAndEventDescCard
