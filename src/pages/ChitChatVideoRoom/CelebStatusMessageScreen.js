import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    height: '50vh',
    position: 'fixed',
    top: '0',
    padding: theme.spacing(0, 2),
    [theme.breakpoints.up('sm')]: {
      height: '100vh',
    },
  },
  messageText: {
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.75rem',
      letterSpacing: '0.003em',
    },
  },
}))

const CelebStatusMessageScreen = ({
  chitChatStatus,
  fanDisconnectedFromChat,
  fanNeverConnected,
}) => {
  const classes = useStyles()

  const displayMessage = () => {
    switch (chitChatStatus) {
      case 'paused':
        return (
          <Typography variant="h4" className={classes.messageText}>
            We hope you enjoyed the call{' '}
            <span role="img" aria-label="hugging smiley">
              🤗
            </span>
            . Take a breather and hit &apos;Meet Next Fan&apos; whenever you&apos;re ready to
            continue!
          </Typography>
        )
      case 'call-in-progress':
        if (!fanNeverConnected) {
          return (
            <Typography variant="h4" className={classes.messageText}>
              Running to grab your next fan{' '}
              <span role="img" aria-label="running man">
                🏃‍♂️
              </span>
              . Give us a few seconds ...
            </Typography>
          )
        }
        if (fanNeverConnected) {
          return (
            <Typography variant="h4" className={classes.messageText}>
              Seems like your fan got lost on the way to the room{' '}
              <span role="img" aria-label="shrug woman">
                🤷‍♀️
              </span>
              . Give them a few seconds to enter or click &apos;end call&apos; to get your next fan
              going!
            </Typography>
          )
        }
        if (fanDisconnectedFromChat) {
          return (
            <Typography variant="h4" className={classes.messageText}>
              Your fan was too star-struck and had to take a breather to recoup{' '}
              <span role="img" aria-label="endearing smiley">
                🥺
              </span>
              . Give them a few seconds to come back or click &apos;end call&apos; to get your next
              fan going!
            </Typography>
          )
        }
        return null
      default:
        return null
    }
  }

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      className={classes.container}
    >
      {displayMessage()}
    </Grid>
  )
}

export default CelebStatusMessageScreen
