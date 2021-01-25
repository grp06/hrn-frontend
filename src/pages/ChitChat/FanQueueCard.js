import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  queueCard: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(1),
    background: theme.palette.common.greyCard,
    textAlign: 'center',
  },
  queueNumber: {
    color: theme.palette.common.basePink,
    fontSize: 20,
    fontWeight: 'bold',
  },
  fanMainContent: {
    margin: theme.spacing(2, 0),
  },
}))

const FanQueueCard = ({ eventStatus, fanIsRSVPed, fansQueueNumber, hostName }) => {
  const classes = useStyles()

  const renderQueueText = () => {
    const hostFirstName = hostName && hostName.split(' ')[0]

    if (fansQueueNumber === 0) {
      if (eventStatus === 'not-started') {
        return `${hostFirstName} hasn't started the event yet. But When it's time you're the first in line!`
      }
      return `You're up next! You'll speak with ${hostFirstName} soon!`
    }
    return (
      <>
        <span className={classes.queueNumber}>{fansQueueNumber}</span>{' '}
        {fansQueueNumber > 1 ? 'people' : 'person'} in front of you
      </>
    )
  }

  const renderFanQueueCardContent = () =>
    fanIsRSVPed ? (
      <Grid direction="column" container className={classes.fanMainContent}>
        <Typography variant="h3">You are now in the queue</Typography>
        <div className={classes.queueCard}>
          <Typography variant="h4">{renderQueueText()}</Typography>
        </div>
        <Typography variant="subtitle1">
          You can leave this page, but if you’re not here when it’s your turn, you will be skipped.
        </Typography>
      </Grid>
    ) : null

  return <div>{renderFanQueueCardContent()}</div>
}

export default FanQueueCard
