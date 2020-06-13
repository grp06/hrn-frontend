import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'
import Typography from '@material-ui/core/Typography'
import MuiAlert from '@material-ui/lab/Alert'
import { makeStyles } from '@material-ui/core/styles'
import { setPartnerXThumb, setPartnerYThumb } from '../gql/mutations'

const useStyles = makeStyles((theme) => ({
  waitingRoom: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    background: '#111',
    height: '100vh',
    alignItems: 'center',
    flexDirection: 'column',
  },
  thumbsUpContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '70%',
  },
  messageText: {
    ...theme.typography.waitingRoomHeading,
  },
  emoji: {
    fontSize: '50px',
  },
}))

const ThumbsUp = ({ myRound, userId }) => {
  console.log('Your boy thumbs up getting called')
  const classes = useStyles()
  const [showThumbUpButton, setShowThumbUpButton] = useState(true)
  const [showSnackbar, setShowSnackbar] = useState(false)

  const [setPartnerXThumbMutation] = useMutation(setPartnerXThumb, {
    variables: {
      round_id: myRound.id,
      partnerX_id: userId,
    },
  })

  const [setPartnerYThumbMutation] = useMutation(setPartnerYThumb, {
    variables: {
      round_id: myRound.id,
      partnerY_id: userId,
    },
  })

  const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setShowSnackbar(false)
  }

  const handleThumbUpClick = () => {
    const iAmPartnerX = myRound.partnerX_id === userId
    if (iAmPartnerX) {
      setPartnerXThumbMutation()
    }
    if (!iAmPartnerX) {
      setPartnerYThumbMutation()
    }
    setShowThumbUpButton(false)
    setShowSnackbar(true)
  }

  return (
    <div className={classes.waitingRoom}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.thumbsUpContainer}
      >
        {showThumbUpButton ? (
          <>
            <Typography className={classes.messageText}>Hope you had a great chat!</Typography>
            <Typography className={classes.messageText}>
              Let us know if you vibed with your partner so we can connect you two after the event!
            </Typography>
            <Button variant="contained" color="primary" onClick={handleThumbUpClick}>
              Connect us 👍
            </Button>
          </>
        ) : (
          <>
            <Typography className={classes.messageText}>Thanks for the feedback!</Typography>
            <Typography className={classes.messageText}>
              Connecting you to a new friend soon!
            </Typography>
            <div className={classes.emoji}>
              <span>🥳</span>
            </div>
            <Snackbar open={showSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
              <Alert onClose={handleSnackbarClose} severity="success">
                Carrier pigeon sent 🕊
              </Alert>
            </Snackbar>
          </>
        )}
      </Grid>
    </div>
  )
}

export default ThumbsUp
