import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useMutation } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { updateLeftChat } from '../../../gql/mutations'

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
  messageText: {
    ...theme.typography.waitingRoomHeading,
  },
  dancingMan: {
    fontSize: '50px',
  },
}))

const PartnerDisconnected = React.memo(({ myRound }) => {
  const { id: row_id } = myRound
  const classes = useStyles()
  const [leftChatMutation] = useMutation(updateLeftChat, {
    variables: {
      row_id,
      reason: 'partner disconnected',
    },
  })

  const handleReturnToLobby = async (mutation) => {
    try {
      await mutation()
      window.location.reload()
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
        <Typography className={classes.messageText}>
          Sorry to break the bad news to you, but your partner disconnected ... something to do with
          squirrels chewing their router{' '}
          <span role="img" aria-label="woman shrugging">
            🤷‍♀️
          </span>
          .
        </Typography>
        <Typography className={classes.messageText}>
          Click the button below and we&apos;ll try to get you a new partner, or stay put and we
          will match you with someone at the end of this round.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            window.analytics.track('left chat - partner disconnected')
            handleReturnToLobby(leftChatMutation)
          }}
        >
          Return To Lobby
        </Button>
      </Grid>
    </div>
  )
})

export default PartnerDisconnected
