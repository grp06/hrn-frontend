import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useMutation } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { useUserEventStatusContext } from '../../../context'
import { updateLeftChat } from '../../../gql/mutations'

const useStyles = makeStyles((theme) => ({
  CTAButton: {
    marginTop: theme.spacing(1.5),
  },
  inEventScreenText: {
    ...theme.typography.inEventScreenText,
  },
  waitingRoom: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    background: '#111',
    height: '100vh',
    alignItems: 'center',
    flexDirection: 'column',
  },
  dancingMan: {
    fontSize: '50px',
  },
}))

const ConnectingToSomeone = React.memo(({ partnerNeverConnected, myRound }) => {
  const { event_id, id: row_id } = myRound
  const classes = useStyles()
  const history = useHistory()
  const { setUserEventStatus } = useUserEventStatusContext()
  const [leftChatMutation] = useMutation(updateLeftChat, {
    variables: {
      row_id,
      reason: 'partner disconnected',
    },
  })

  const handleReturnToLobby = async () => {
    try {
      await leftChatMutation()
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
            <Typography className={classes.inEventScreenText}>
              Connecting you to someone awesome!
            </Typography>
            <Typography className={classes.inEventScreenText}>
              Give us a few seconds to roll out your red carpet{' '}
              <span role="img" aria-label="woman dancing">
                💃
              </span>
              .
            </Typography>
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
