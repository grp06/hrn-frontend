import React from 'react'
import { Avatar, Grid, Typography } from '@material-ui/core'
import logo from '../../assets/HRNlogoNoFrame.svg'
import { useEventStyles } from '.'
import { EventObjectInterface } from '../../utils'

interface HostAndEventDescCardProps {
  event: EventObjectInterface
  numberOfOnlineEventUsers?: number
  userIsHost: boolean
}

const HostAndEventDescCard: React.FC<HostAndEventDescCardProps> = React.memo(
  ({ event, numberOfOnlineEventUsers, userIsHost }) => {
    const classes = useEventStyles()
    const { description: eventDescription, event_users, host } = event
    const { first_name, last_name, profile_pic_url } = host

    return (
      <Grid container direction="column" className={classes.eventAndLobbyContentCard}>
        <Grid
          container
          direction="row"
          justify="space-between"
          className={classes.hostAndRSVPContainer}
        >
          <Grid container item direction="column" xs={12} sm={6}>
            <Typography variant="subtitle1" className={classes.onlineAndRSVPedTypography}>
              Hosted By /
            </Typography>
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="flex-start"
              className={classes.hostContainer}
            >
              <Avatar className={classes.hostAvatarContainer}>
                <img
                  alt="company-logo"
                  className={classes.hostAvatar}
                  src={profile_pic_url || logo}
                />
              </Avatar>
              <Grid
                container
                direction="column"
                justify="center"
                wrap="nowrap"
                className={classes.hostNameAndTitleContainer}
              >
                <Typography variant="h3" className={classes.hostName}>
                  {`${first_name} ${last_name}`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            item
            xs={12}
            sm={6}
            direction="row"
            justify="flex-end"
            className={classes.rsvpAndOnlineNumberContainer}
          >
            {userIsHost || (!userIsHost && event_users.length > 9) ? (
              <Grid
                container
                direction="column"
                justify="space-between"
                alignItems="center"
                className={classes.rsvpedNumberContainer}
              >
                <Typography variant="subtitle1" className={classes.onlineAndRSVPedTypography}>
                  RSVP&apos;ed /
                </Typography>
                <Typography className={classes.largeNumber}>{event_users.length}</Typography>
              </Grid>
            ) : null}
            {numberOfOnlineEventUsers && userIsHost ? (
              <Grid
                container
                direction="column"
                justify="space-between"
                alignItems="center"
                className={classes.onlineAttendeesNumberContainer}
              >
                <Typography variant="subtitle1" className={classes.onlineAndRSVPedTypography}>
                  Online Now /
                </Typography>
                <Typography className={classes.largeNumber}>{numberOfOnlineEventUsers}</Typography>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
        <Grid container item direction="row" justify="flex-start" md={11}>
          <Typography variant="body1">{eventDescription}</Typography>
        </Grid>
      </Grid>
    )
  }
)

export default HostAndEventDescCard
