import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { addFriend, updatePartnerRating, updatePartnerSharedDetails } from '../../gql/mutations'
import { sleep } from '../../helpers'
import { Snack } from '../../common'
import { useEventContext } from '../../context'

const useStyles = makeStyles((theme) => ({
  CTAButton: {
    marginTop: theme.spacing(1.5),
  },
  inEventScreenText: {
    ...theme.typography.inEventScreenText,
  },
  emoji: {
    fontSize: '50px',
    padding: theme.spacing(0, 2),
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
      backgroundColor: theme.palette.common.basePurple,
      color: theme.palette.common.ghostWhite,
    },
    '&:hover .MuiFab-label .MuiGrid-root .MuiTypography-subtitle2': {
      color: theme.palette.common.ghostWhite,
      fontWeight: '700',
    },
  },
  fabButtonGrid: {
    height: '75%',
  },
  fabText: {
    color: theme.palette.common.basePurple,
    fontWeight: '700',
  },
}))

const PostChatRating = ({ myRound, setUserEventStatus }) => {
  const classes = useStyles()
  const { event } = useEventContext()
  const { current_round, num_rounds } = event
  const { event_id, partner_id, user_id } = myRound
  const [showRatingForm, setShowRatingForm] = useState(true)
  const [showRatingSnack, setShowRatingSnack] = useState(false)
  const [updatePartnerRatingMutation] = useMutation(updatePartnerRating)

  const [addFriendMutation] = useMutation(addFriend, {
    variables: {
      event_id,
      user_id,
      partner_id,
    },
  })

  const [partnerSharedDetailsMutation] = useMutation(updatePartnerSharedDetails, {
    variables: {
      event_id,
      user_id: partner_id,
      partner_id: user_id,
    },
  })

  const handleUpdateRating = async (ratingValue) => {
    window.analytics.track('gave rating', {
      rating: ratingValue,
    })
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

      if (ratingValue === 5) {
        await addFriendMutation()
        await partnerSharedDetailsMutation()
      }

      setShowRatingSnack(true)
    } catch (err) {
      console.log(err)
    }
    sleep(300)
    setShowRatingForm(false)
  }

  const handleTakeABreak = () => {
    console.log('hello from handle take a break')
    setUserEventStatus('sitting out')
  }

  const renderRating = () => {
    return (
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
          className={classes.buttonContainer}
        >
          <Fab disableRipple onClick={() => handleUpdateRating(1)} className={classes.fabButton}>
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
          <Fab disableRipple onClick={() => handleUpdateRating(3)} className={classes.fabButton}>
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
          <Fab disableRipple onClick={() => handleUpdateRating(5)} className={classes.fabButton}>
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
  }

  const renderBreak = () => {
    return (
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
  }

  const renderEventFinish = () => {
    return (
      <>
        <Typography className={classes.inEventScreenText}>
          Awesome! Thanks for joining the event!{' '}
          <span role="img" aria-label="sunglass smiley">
            😎
          </span>
        </Typography>
      </>
    )
  }

  const renderPostChatRating = () => {
    if (!!showRatingForm) {
      return renderRating()
    } else {
      if (current_round == num_rounds) {
        return renderEventFinish()
      } else {
        return renderBreak()
      }
    }
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
