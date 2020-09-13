import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Rating from '@material-ui/lab/Rating'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import { makeStyles } from '@material-ui/styles'
import { updatePartnerRating } from '../../gql/mutations'
import { sleep } from '../../helpers'
import { Snack } from '../../common'

const useStyles = makeStyles((theme) => ({
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
  starsContainer: {
    margin: theme.spacing(2, 0),
  },
  underline: {
    textDecoration: 'underline',
  },
  messageText: {
    ...theme.typography.waitingRoomHeading,
  },
}))

const PostChatRating = ({ myRound }) => {
  const classes = useStyles()
  const { event_id, partner_id, user_id } = myRound
  const [showRatingForm, setShowRatingForm] = useState(true)
  const [showRatingSnack, setShowRatingSnack] = useState(false)
  const [ratingValue, setRatingValue] = useState(null)

  const [updatePartnerRatingMutation] = useMutation(updatePartnerRating)

  const handleUpdateRating = async (event, ratingValue) => {
    setRatingValue(ratingValue)
    // console.log('rating=', ratingValue)
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
    // console.log('rating=', ratingValue)
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
            <Typography variant="h5">Hope you had a great chat!</Typography>
            <Typography variant="h5">Help us improve your matches in the future!</Typography>
            <Typography variant="h4">
              How would you rate <span className={classes.underline}>this</span> match?
            </Typography>
            <div className={classes.starsContainer}>
              <Rating
                name="simple-controlled"
                value={ratingValue}
                onChange={handleUpdateRating}
                size="large"
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
              />
            </div>
          </>
        ) : (
          <>
            <Typography className={classes.messageText}>
              Connecting you to someone awesome!
            </Typography>
            <Typography className={classes.messageText}>
              Take a 20 second breather before your next match.
            </Typography>
            <div className={classes.emoji}>
              <span role="img" aria-label="party smiley">
                🥳
              </span>
            </div>
          </>
        )}
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
