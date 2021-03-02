import React from 'react'
import { Grid, Button, Typography } from '@material-ui/core'
import { useMutation } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { useTwilioContext, useUserEventStatusContext } from '../../../context'
import { updateLeftChat } from '../../../gql/mutations'
import { useVideoRoomStyles } from '..'

const PartnerDisconnected = React.memo(({ myRound }) => {
  const { event_id, id: row_id } = myRound
  const classes = useVideoRoomStyles()
  const history = useHistory()
  const { setMyRound } = useTwilioContext()
  const { setUserEventStatus } = useUserEventStatusContext()
  const [leftChatMutation] = useMutation(updateLeftChat, {
    variables: {
      row_id,
      reason: 'partner disconnected',
    },
  })

  const handleReturnToLobby = async (mutation) => {
    try {
      await mutation()
      await window.room.disconnect()
      console.log('disconnecting from room')
      window.room = null
      setMyRound(null)
      setUserEventStatus('left chat')
      window.analytics.track('left chat - partner disconnected')
      history.push(`/events/${event_id}/lobby`)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={classes.waitingRoom}>
      <Grid
        container
        item
        justify="center"
        alignItems="center"
        alignContent="center"
        lg={8}
        xs={10}
      >
        <Typography className={classes.inEventScreenText}>
          Sorry to break the bad news to you, but your partner disconnected ... something to do with
          squirrels chewing their router{' '}
          <span role="img" aria-label="woman shrugging">
            🤷‍♀️
          </span>
          .
        </Typography>
        <Typography className={classes.inEventScreenText}>
          Click the button below and we&apos;ll try to get you a new partner, or stay put and we
          will match you with someone at the end of this round.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.CTAButton}
          onClick={() => handleReturnToLobby(leftChatMutation)}
        >
          Return To Lobby
        </Button>
      </Grid>
    </div>
  )
})

export default PartnerDisconnected
