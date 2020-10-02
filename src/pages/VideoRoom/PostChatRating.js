import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import Fab from '@material-ui/core/Fab'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { updatePartnerRating } from '../../gql/mutations'
import { sleep } from '../../helpers'
import { Snack } from '../../common'

const useStyles = makeStyles((theme) => ({
  emoji: {
    fontSize: '50px',
    padding: theme.spacing(0, 2),
  },
  messageText: {
    ...theme.typography.waitingRoomHeading,
  },
  pageContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    background: '#111',
    height: '100vh',
    alignItems: 'center',
    flexDirection: 'column',
  },
  ratingContainer: {
    margin: theme.spacing(0, 'auto'),
    width: '70%',
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
    },
  },
  buttonContainer: {
    width: '60%',
    margin: theme.spacing(5, 0, 0, 0),
    [theme.breakpoints.down('md')]: {
      width: '80%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  fabButton: {
    width: '120px',
    height: '120px',
    lineHeight: 1.25,
    '&:hover': {
      backgroundColor: theme.palette.common.dankPurp,
      color: theme.palette.common.ghostWhite,
    },
    '&:hover .MuiFab-label .MuiGrid-root .MuiTypography-subtitle2': {
      color: theme.palette.common.ghostWhite,
    },
  },
  fabButtonGrid: {
    height: '75%',
  },
  fabText: {
    color: theme.palette.common.dankPurp,
  },
  userStatusBoxContainer: {
    position: 'absolute',
    top: '5%',
    right: '1%',
    bottom: 'auto',
    left: 'auto',
    width: '225px',
    zIndex: 9999,
  },
}))

const PostChatRating = ({ myRound, userStatusBox }) => {
  const classes = useStyles()
  const { event_id, partner_id, user_id } = myRound
  const [showRatingForm, setShowRatingForm] = useState(true)
  const [showRatingSnack, setShowRatingSnack] = useState(false)

  const [updatePartnerRatingMutation] = useMutation(updatePartnerRating)

  const handleUpdateRating = async (ratingValue) => {
    try {
      await updatePartnerRatingMutation({
        variables: {
          event_id,
          partner_id,
          user_id,
          rating: ratingValue,
        },
        skip: !ratingValue,
      })
      setShowRatingSnack(true)
    } catch (err) {
      console.log(err)
    }
    sleep(300)
    setShowRatingForm(false)
  }

  return (
    <div className={classes.pageContainer}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.ratingContainer}
      >
        {showRatingForm ? (
          <>
            <Typography variant="h4" className={classes.messageText}>
              Hope you had a great chat!
            </Typography>
            <Typography variant="h4" className={classes.messageText}>
              Would you be excited to match with this person in a future event?
            </Typography>
            <Typography variant="subtitle1">
              (Don&apos;t worry, this will stay just between us!)
            </Typography>
            <Grid
              container
              justify="space-around"
              alignItems="center"
              className={classes.buttonContainer}
            >
              <Fab
                disableRipple
                onClick={() => handleUpdateRating(1)}
                className={classes.fabButton}
              >
                <Grid
                  container
                  direction="column"
                  justify="center"
                  alignItems="center"
                  className={classes.fabButtonGrid}
                >
                  <span className={classes.emoji} role="img" aria-label="woman no">
                    🙅‍♀️
                  </span>
                  <Typography variant="subtitle2" className={classes.fabText}>
                    No..
                  </Typography>
                </Grid>
              </Fab>
              <Fab
                disableRipple
                onClick={() => handleUpdateRating(3)}
                className={classes.fabButton}
              >
                <Grid
                  container
                  direction="column"
                  justify="center"
                  alignItems="center"
                  className={classes.fabButtonGrid}
                >
                  <span className={classes.emoji} role="img" aria-label="woman shrug">
                    🤷‍♀️
                  </span>
                  <Typography variant="subtitle2" className={classes.fabText}>
                    Maybe?
                  </Typography>
                </Grid>
              </Fab>
              <Fab
                disableRipple
                onClick={() => handleUpdateRating(5)}
                className={classes.fabButton}
              >
                <Grid
                  container
                  direction="column"
                  justify="center"
                  alignItems="center"
                  className={classes.fabButtonGrid}
                >
                  <span className={classes.emoji} role="img" aria-label="woman hand out">
                    💁‍♀️
                  </span>
                  <Typography variant="subtitle2" className={classes.fabText}>
                    Yes!
                  </Typography>
                </Grid>
              </Fab>
            </Grid>
          </>
        ) : (
          <>
            <Typography className={classes.messageText}>
              Got it! Thanks for letting us know.
            </Typography>
            <Typography className={classes.messageText}>
              Connecting you to someone new soon!
            </Typography>
            <div className={classes.emoji}>
              <span role="img" aria-label="party smiley">
                🥳
              </span>
            </div>
          </>
        )}
        <div className={classes.userStatusBoxContainer}>{userStatusBox}</div>
        <Snack
          open={showRatingSnack}
          onClose={() => setShowRatingSnack(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          duration={6000}
          severity="success"
          snackMessage={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <div>
              Carrier pigeon sent{' '}
              <span role="img" aria-label="dove">
                🕊
              </span>
            </div>
          }
        />
      </Grid>
    </div>
  )
}

export default PostChatRating
