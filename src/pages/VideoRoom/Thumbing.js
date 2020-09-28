import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useMutation } from 'react-apollo'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { useEventContext } from '../../context'
import { setPartnerXThumb, setPartnerYThumb } from '../../gql/mutations'
import { Snack } from '../../common'

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
    margin: theme.spacing(0, 'auto'),
    width: '70%',
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
    },
  },
  buttonContainer: {
    width: '35%',
    [theme.breakpoints.down('md')]: {
      width: '70%',
    },
  },
  messageText: {
    ...theme.typography.waitingRoomHeading,
  },
  thumbingButton: {
    margin: theme.spacing(1.5, 0),
  },
  noThanksButton: {
    margin: theme.spacing(1.5, 0),
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

const Thumbing = ({ myRound, userId }) => {
  const classes = useStyles()
  const history = useHistory()
  const { event } = useEventContext()
  const [showThumbUpButton, setShowThumbUpButton] = useState(true)
  const [userThumbed, setUserThumbed] = useState(false)
  const [showThumbSnack, setShowThumbSnack] = useState(false)

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

  const handleThumbUpClick = () => {
    const iAmPartnerX = myRound.partnerX_id === userId
    if (iAmPartnerX) {
      window.analytics.track('Thumbs up given')
      setPartnerXThumbMutation()
    }
    if (!iAmPartnerX) {
      window.analytics.track('Thumbs up given')
      setPartnerYThumbMutation()
    }
    setShowThumbUpButton(false)
    setUserThumbed(true)
    setShowThumbSnack(true)
    if (event.status === 'complete') {
      history.push(`/events/${event.id}/event-complete`)
    }
  }

  const handlePassOnThumbingClick = () => {
    window.analytics.track('Pass on thumbs up')

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
              <Button
                variant="contained"
                color="primary"
                onClick={handleThumbUpClick}
                className={classes.thumbingButton}
              >
                Connect Us{' '}
                <span role="img" aria-label="thumbs up">
                  👍
                </span>
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={classes.noThanksButton}
                onClick={handlePassOnThumbingClick}
              >
                No Thanks{' '}
                <span role="img" aria-label="halo smiley">
                  😇
                </span>
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
                  <span role="img" aria-label="party smiley">
                    🥳
                  </span>
                </div>
              </>
            ) : (
              <>
                <Typography className={classes.messageText}>
                  Sorry to Hear!{' '}
                  <span role="img" aria-label="dissapointed face">
                    😔
                  </span>
                </Typography>
                <Typography className={classes.messageText}>
                  This next person is going to be great!
                </Typography>
              </>
            )}
            <Snack
              open={showThumbSnack}
              onClose={() => setShowThumbSnack(false)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              duration={6000}
              severity="success"
              snackMessage={
                <div>
                  Carrier pigeon sent{' '}
                  <span role="img" aria-label="dove">
                    🕊
                  </span>
                </div>
              }
            />
          </>
        )}
      </Grid>
    </div>
  )
}

export default Thumbing
