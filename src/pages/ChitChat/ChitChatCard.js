import React from 'react'
import FeatherIcon from 'feather-icons-react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { formatDate } from '../../utils'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    backgroundColor: theme.palette.common.greyCard,
    height: '250px',
    marginTop: '75px',
    padding: theme.spacing(2),
    position: 'relative',
    width: '100%',
  },
  editEventButton: {
    '&:hover': {
      cursor: 'pointer',
      color: theme.palette.common.basePink,
    },
    position: 'absolute',
    top: 'auto',
    right: '16px',
    bottom: '16px',
    left: 'auto',
  },
  numberOfRSVPsBadge: {
    backgroundColor: theme.palette.common.basePurple,
    borderRadius: '4px',
    padding: theme.spacing(1),
    position: 'absolute',
    top: '20px',
    right: '16px',
    bottom: 'auto',
    left: 'auto',
    width: 'auto',
  },
  subtitle: {
    lineHeight: '1',
    marginLeft: theme.spacing(0.5),
    width: 'auto',
  },
}))

const ChitChatCard = ({ chitChat, userIsHost }) => {
  const classes = useStyles()
  const { event_users_new, host, start_at } = chitChat
  const { name: hostName } = host
  const startTime = new Date(start_at).getTime()

  const renderEditEventButton = () => {
    return userIsHost ? (
      <FeatherIcon
        icon="edit-2"
        stroke="#f4f6fa"
        size="22"
        className={classes.editEventButton}
        onClick={() => console.log('hey')}
      />
    ) : null
  }

  return (
    <Grid container direction="row" className={classes.cardContainer}>
      <Grid container direction="column" justify="flex-end">
        <Typography variant="h2" style={{ marginBottom: '8px' }}>
          Meet with {hostName}
        </Typography>
        <Grid item container direction="row" alignItems="flex-end">
          <FeatherIcon icon="calendar" stroke="#f4f6fa" size="18" />
          <Typography variant="subtitle2" className={classes.subtitle}>
            {formatDate(startTime)}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.numberOfRSVPsBadge}
      >
        <Typography variant="h2">{event_users_new.length}</Typography>
        <Typography variant="subtitle2">RSVPed</Typography>
      </Grid>
      {renderEditEventButton()}
    </Grid>
  )
}

export default ChitChatCard
