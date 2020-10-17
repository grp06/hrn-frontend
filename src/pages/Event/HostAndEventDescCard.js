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
    marginTop: '14px',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      height: '100%',
      marginTop: '14px',
    },
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
  },
  hostAndRSVPContainer: {
    marginBottom: theme.spacing(4),
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
  subtitle: {
    marginBottom: theme.spacing(1),
  },
}))

const HostAndEventDescCard = React.memo(({ event }) => {
  const classes = useStyles()
  const { description: eventDescription, event_users, host } = event
  const { name: hostName } = host

  return (
    <Grid container direction="column" className={classes.cardContainer}>
      <Grid
        container
        direction="row"
        justify="space-between"
        className={classes.hostAndRSVPContainer}
      >
        <Grid item direction="column" md={6}>
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
              <img alt="company-logo" className={classes.avatar} src={logo} />
            </Avatar>
            <Grid
              container
              direction="column"
              justify="space-between"
              className={classes.hostNameAndTitleContainer}
            >
              <Typography variant="h2" className={classes.hostName}>
                {hostName}
              </Typography>
              <Typography variant="subtitle1">European Gigaloo</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item md={6} direction="row" justify="flex-end">
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
        </Grid>
      </Grid>
      <Grid container item direction="row" justify="flex-start" md={11}>
        <Typography variant="body1">{eventDescription}</Typography>
      </Grid>
    </Grid>
  )
})

export default HostAndEventDescCard
