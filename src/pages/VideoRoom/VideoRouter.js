import React from 'react'
import { useTwilioContext } from '../../context'
import { useVideoRoomStyles } from '.'
import { ConnectingToSomeone, PartnerDisconnected } from './waitingRoomScreens'
import { Button, Typography, Grid } from '@material-ui/core'

const VideoRouter = ({ eventStatus, myRound, setUserEventStatus, event }) => {
  const { current_round, num_rounds } = event

  const {
    partnerDisconnected,
    partnerNeverConnected,
    hasPartnerAndIsConnecting,
  } = useTwilioContext()
  const classes = useVideoRoomStyles()

  const handleTakeABreak = () => {
    setUserEventStatus('sitting out')
  }

  const renderBreak = () => (
    <>
      <Typography className={classes.inEventScreenText}>
        Hope you had a great conversation! Hang tight as we&apos;re matching you with someone in a
        few seconds{' '}
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

  const renderGroupChatOrEndEvent = () => (
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
  )

  const displayVideoMessage = () => {
    const hasRoundsData = myRound !== 'no-assignment'
    const hasPartner = !hasRoundsData ? false : myRound.partner_id
    switch (eventStatus) {
      case 'in-between-rounds':
        return (
          <div className={classes.pageContainer}>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              className={classes.ratingContainer}
            >
              {current_round === num_rounds ? renderGroupChatOrEndEvent() : renderBreak()}
            </Grid>
          </div>
        )
      case 'room-in-progress':
        if (hasPartnerAndIsConnecting) {
          return (
            <ConnectingToSomeone partnerNeverConnected={partnerNeverConnected} myRound={myRound} />
          )
        }

        if (partnerDisconnected && hasPartner) {
          return <PartnerDisconnected myRound={myRound} />
        }
        return null
      case 'complete':
        return null
      default:
        return null
    }
  }

  return <div>{displayVideoMessage()}</div>
}
export default VideoRouter
