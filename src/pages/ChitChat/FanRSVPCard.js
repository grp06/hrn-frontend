import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  queueCard: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(1),
    background: theme.palette.common.greyCard,
    borderRadius: '4px',
    border: '1px solid #3e4042',
    textAlign: 'center',
  },
  queueNumber: {
    color: theme.palette.common.basePink,
    fontSize: 20,
    fontWeight: 'bold',
  },
  fanMainContent: {
    margin: theme.spacing(2, 0, 4, 0),
  },
}))

const FanRSVPCard = ({ eventStatus, fanIsRSVPed, fansQueueNumber, hostName }) => {
  const classes = useStyles()
  const hostFirstName = hostName && hostName.split(' ')[0]

  const renderQueueText = () => {
    if (fansQueueNumber === 0) {
      return (
        <Typography variant="h6">
          {hostFirstName} hasn't started the event yet. But when it's time you're the first in line!
        </Typography>
      )
    }
    return (
      <Typography variant="h6">
        {hostFirstName} hasn't started the event yet. But when it's time you're number{' '}
        <span className={classes.queueNumber}>{fansQueueNumber + 1}</span> in line!
      </Typography>
    )
  }

  const renderFanRSVPCardContent = () =>
    fanIsRSVPed ? (
      <Grid direction="column" container className={classes.fanMainContent}>
        <Typography variant="h3">
          You&apos;re all set to meet {hostFirstName}{' '}
          <span role="img" aria-label="party smiley">
            🥳
          </span>{' '}
        </Typography>
        <div className={classes.queueCard}>{renderQueueText()}</div>
        <Typography variant="subtitle1">
          You can leave this page, but if you’re not here when it’s your turn, you will be skipped.
          Don&apos;t worry, we&apos;ll send you a SMS text when your turn is coming up!{' '}
          <span role="img" aria-label="thumbs up">
            👍
          </span>
        </Typography>
      </Grid>
    ) : null

  return <div>{renderFanRSVPCardContent()}</div>
}

export default FanRSVPCard
