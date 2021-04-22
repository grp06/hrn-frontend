import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Button, Fab, Grid, Typography } from '@material-ui/core'
import { Snack } from '../../common'
import { useEventContext } from '../../context'
import { updatePartnerRating } from '../../gql/mutations'
import { sleep } from '../../helpers'
import { constants } from '../../utils'
import { useVideoRoomStyles } from '.'

const PostChatRating = ({ myRound, setUserEventStatus }) => {
  const classes = useVideoRoomStyles()
  const { event } = useEventContext()
  const { current_round, group_video_chat, num_rounds, id: eventId } = event
  const { partner_id, user_id } = myRound
  const { postChatRatingSnackMessagesArray } = constants
  const [showRatingForm, setShowRatingForm] = useState(true)
  const [showRatingSnack, setShowRatingSnack] = useState(false)
  const [ratingSnackMessage, setRatingSnackMessage] = useState('')
  const [updatePartnerRatingMutation] = useMutation(updatePartnerRating)

  const handleUpdateRating = async (ratingValue) => {
    window.analytics.track('gave rating', {
      rating: ratingValue,
    })
    try {
      await updatePartnerRatingMutation({
        variables: {
          event_id: eventId,
          partner_id,
          user_id,
          rating: ratingValue,
        },
        skip: !ratingValue,
      })

      const randomMessage = Math.floor(Math.random() * postChatRatingSnackMessagesArray.length)
      setRatingSnackMessage(postChatRatingSnackMessagesArray[randomMessage])
      setShowRatingSnack(true)
    } catch (err) {
      console.log(err)
    }
    sleep(300)
    setShowRatingForm(false)
  }

  const closeRatingSnack = () => {
    setRatingSnackMessage('')
    setShowRatingSnack(false)
  }

  const handleTakeABreak = () => {
    setUserEventStatus('sitting out')
  }

  const renderRating = () => (
    <>
      <Typography className={classes.inEventScreenText}>Hope you had a great chat!</Typography>
      <Typography className={classes.inEventScreenText}>
        Would you be excited to match with this person in a future event?
      </Typography>
      <Typography variant="subtitle1">
        (Don&apos;t worry, this will stay just between us!)
      </Typography>
      <Grid
        container
        justify="space-around"
        alignItems="center"
        className={classes.postChatRatingButtonContainer}
      >
        <Fab
          disableRipple
          onClick={() => handleUpdateRating(1)}
          className={classes.postChatRatingFabButton}
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
          className={classes.postChatRatingFabButton}
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
          className={classes.postChatRatingFabButton}
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
  )

  const renderBreak = () => (
    <>
      <Typography className={classes.inEventScreenText}>
        Awesome! Hang tight as we&apos;re matching you with someone awesome really soon{' '}
        <span role="img" aria-label="sunglass smiley">
          😎
        </span>
      </Typography>
      <Typography className={classes.inEventScreenText}>
        If you need a break, just press the button below!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        className={classes.CTAButton}
        onClick={handleTakeABreak}
      >
        Take a break
      </Button>
    </>
  )

  const renderGroupChatOrEndEvent = () =>
    group_video_chat ? (
      <>
        <Typography className={classes.inEventScreenText}>
          And the party continues{' '}
          <span role="img" aria-label="party smiley">
            🥳
          </span>
        </Typography>
        <Typography className={classes.inEventScreenText}>
          Ushering you to the group chat in a few seconds!
        </Typography>
      </>
    ) : (
      <>
        <Typography className={classes.inEventScreenText}>
          Thanks for coming to the event{' '}
          <span role="img" aria-label="cowboy smiley">
            🤠
          </span>
        </Typography>
      </>
    )

  const renderPostChatRating = () => {
    if (showRatingForm) {
      return renderRating()
    }
    if (current_round === num_rounds) {
      return renderGroupChatOrEndEvent()
    }
    return renderBreak()
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
        {renderPostChatRating()}
        <Snack
          open={showRatingSnack}
          onClose={closeRatingSnack}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          duration={6000}
          severity="success"
          snackMessage={ratingSnackMessage}
        />
      </Grid>
    </div>
  )
}

export default PostChatRating
