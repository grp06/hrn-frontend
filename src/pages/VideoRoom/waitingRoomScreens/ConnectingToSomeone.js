import React, { useEffect, useState } from 'react'
import { Grid, Button, Typography } from '@material-ui/core'
import { useMutation } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { useVideoRoomStyles } from '..'
import { useTwilioContext, useUserEventStatusContext } from '../../../context'
import { updateLeftChat } from '../../../gql/mutations'
import { constants } from '../../../utils'

const ConnectingToSomeone = React.memo(({ partnerNeverConnected, myRound }) => {
  const { event_id, id: row_id } = myRound
  const { connectingYouToSomeoneMessagesArray } = constants
  const classes = useVideoRoomStyles()
  const history = useHistory()
  const { setUserEventStatus } = useUserEventStatusContext()
  const { setMyRound } = useTwilioContext()
  const [connectingMessage, setConnectingMessage] = useState([])
  const [leftChatMutation] = useMutation(updateLeftChat, {
    variables: {
      row_id,
      reason: 'partner disconnected',
    },
  })

  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * connectingYouToSomeoneMessagesArray.length)
    setConnectingMessage(connectingYouToSomeoneMessagesArray[randomNumber])
  }, [connectingYouToSomeoneMessagesArray])

  const handleReturnToLobby = async () => {
    window.analytics.track('left chat - partner took too long')
    try {
      await leftChatMutation()
      await window.room.disconnect()
      console.log('disconnecting from room')
      setMyRound(null)
      window.room = null
      setUserEventStatus('left chat')
      history.push(`/events/${event_id}/lobby`)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={classes.waitingRoom}>
      <Grid
        item
        container
        justify="center"
        alignItems="center"
        alignContent="center"
        lg={8}
        xs={10}
      >
        {!partnerNeverConnected ? (
          <>
            <Typography className={classes.inEventScreenText}>{connectingMessage[0]}</Typography>
            <Typography className={classes.inEventScreenText}>{connectingMessage[1]}</Typography>
          </>
        ) : (
          <>
            <Typography className={classes.inEventScreenText}>
              Seems like things are taking a bit too long{' '}
              <span role="img" aria-label="inquisitive face">
                🧐
              </span>
            </Typography>
            <Typography className={classes.inEventScreenText}>
              Stay put and wait for your partner to connect, or click the button below to go back to
              the lobby and possibly get rematched with someone new!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.CTAButton}
              onClick={() => handleReturnToLobby()}
            >
              Return To Lobby
            </Button>
          </>
        )}
      </Grid>
    </div>
  )
})

export default ConnectingToSomeone
