import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useMutation } from 'react-apollo'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'
import Typography from '@material-ui/core/Typography'
import MuiAlert from '@material-ui/lab/Alert'
import { makeStyles } from '@material-ui/core/styles'
import { useAppContext } from '../context/useAppContext'
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
  buttonContainer: {
    width: '35%',
  },
  messageText: {
    ...theme.typography.waitingRoomHeading,
  },
  noThanksButton: {
    backgroundColor: theme.palette.common.greyButton,
    color: theme.palette.common.ghostWhite,
    '&:hover': {
      backgroundColor: theme.palette.common.greyButtonHover,
    },
  },
  emoji: {
    fontSize: '50px',
  },
}))

const ThumbsUp = ({ myRound, userId }) => {
  const classes = useStyles()
  const history = useHistory()
  const { event } = useAppContext()
  const [showThumbUpButton, setShowThumbUpButton] = useState(true)
  const [userThumbed, setUserThumbed] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)

  const [setPartnerXThumbMutation] = useMutation(setPartnerXThumb, {
    variables: {
      round_id: myRound.id,
      partnerX_id: userId,
    },
    skip: !myRound,
  })

  const [setPartnerYThumbMutation] = useMutation(setPartnerYThumb, {
    variables: {
      round_id: myRound.id,
      partnerY_id: userId,
    },
    skip: !myRound,
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
    setUserThumbed(true)
    setShowSnackbar(true)
    if (event.status === 'complete') {
      history.push(`/events/${event.id}/event-complete`)
    }
  }

  const handlePassOnThumbingClick = () => {
    setShowThumbUpButton(false)
    setUserThumbed(false)
    if (event.status === 'complete') {
      history.push(`/events/${event.id}/event-complete`)
    }
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
            <Grid
              container
              item
              direction="row"
              justify="space-around"
              alignItems="center"
              className={classes.buttonContainer}
            >
              <Button variant="contained" color="primary" onClick={handleThumbUpClick}>
                Connect Us 👍
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={classes.noThanksButton}
                onClick={handlePassOnThumbingClick}
              >
                No Thanks 😇
              </Button>
            </Grid>
          </>
        ) : (
          <>
            {userThumbed ? (
              <>
                <Typography className={classes.messageText}>Awesome!</Typography>
                <Typography className={classes.messageText}>
                  Connecting you to a new friend soon!
                </Typography>
                <div className={classes.emoji}>
                  <span>🥳</span>
                </div>
              </>
            ) : (
              <>
                <Typography className={classes.messageText}>Sorry to Hear! 😔</Typography>
                <Typography className={classes.messageText}>
                  This next person is going to be great!
                </Typography>
              </>
            )}

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
