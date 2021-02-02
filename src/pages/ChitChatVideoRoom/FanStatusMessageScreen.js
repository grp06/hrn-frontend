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

const FanStatusMessageScreen = ({
  chitChatStatus,
  fanDisconnectedFromChat,
  fanNeverConnected,
  hostName,
}) => {
  const classes = useStyles()

  const displayMessage = () => {
    switch (chitChatStatus) {
      case 'call-in-progress':
        if (!fanNeverConnected) {
          return (
            <Typography variant="h4" className={classes.messageText}>
              Connecting you with {hostName} now! Let&apos;s see your biggest smile{' '}
              <span role="img" aria-label="star smiley">
                🤩
              </span>
            </Typography>
          )
        }
        if (fanNeverConnected) {
          return (
            <Typography variant="h4" className={classes.messageText}>
              Seems like {hostName} is having some issues connecting{' '}
              <span role="img" aria-label="surprised face">
                😯
              </span>
              . Give them a few seconds or refresh this page and try again!
            </Typography>
          )
        }
        if (fanDisconnectedFromChat) {
          return (
            <Typography variant="h4" className={classes.messageText}>
              {hostName} was overwhelmed with the love and had to take a breather to recoup{' '}
              <span role="img" aria-label="endearing smiley">
                🥺
              </span>
              . Give them a few seconds to come back!
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

export default FanStatusMessageScreen
