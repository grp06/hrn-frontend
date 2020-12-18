import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Typography from '@material-ui/core/Typography'
import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import { makeStyles } from '@material-ui/core/styles'

import { useHistory } from 'react-router-dom'
import { useTwilioContext, useUserEventStatusContext } from '../../context'
import { updateLeftChat } from '../../gql/mutations'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    border: '2px solid #8C57DB',
    boxShadow: '4px 4px 0 #8C57DB',
    width: '55vw',
    minWidth: '20vw',
    height: 'auto',
    padding: '40px',
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
    },
  },
  modalBody: {
    ...theme.typography.modalBody,
    marginBottom: '20px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '50%',
    [theme.breakpoints.down('md')]: {
      width: '80%',
    },
  },
  acceptButton: {
    margin: theme.spacing(1.5, 0),
  },
}))

const ConnectionIssuesModal = ({ myRound, open, setOpen }) => {
  const { event_id, id: row_id } = myRound
  const classes = useStyles()
  const history = useHistory()
  const { setUserEventStatus } = useUserEventStatusContext()
  const { setMyRound } = useTwilioContext()
  const [openModal, setModalOpen] = useState(open)
  const [acceptFunctionInFlight, setAcceptFunctionInFlight] = useState(false)
  const [leftChatMutation] = useMutation(updateLeftChat, {
    variables: {
      row_id,
      reason: 'connection issues',
    },
  })

  const closeModal = () => {
    setModalOpen(false)
    setOpen(false)
  }

  const exitChat = async () => {
    try {
      await leftChatMutation()
      closeModal()
      await window.room.disconnect()
      setMyRound(null)
      console.log('disconnecting from room')
      window.room = null
      setUserEventStatus('left chat')
      history.push(`/events/${event_id}/lobby`)
    } catch (err) {
      console.log(err)
    }
  }

  const onAcceptClick = () => {
    exitChat()
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={openModal}
      onClose={closeModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className={classes.paper}
        >
          <Grid container justify="center" className={classes.modalBody}>
            <Typography variant="h3" gutterBottom style={{ marginBottom: '20px' }}>
              Having Connection Issues?{' '}
              <span role="img" aria-label="frowning face">
                😦
              </span>
            </Typography>
            <Typography variant="body1" gutterBottom>
              Most of our connection issues can be solved by a simple page refresh, or changing your
              camera / mic settings by pressing on the gear icon.
            </Typography>
            <Typography variant="body1" gutterBottom>
              If that doesn&apos;t solve the problem, then click on the &apos;leave chat&apos;
              button below and we will try to match you with an available user for the duration of
              the round.
            </Typography>
          </Grid>

          <Grid
            container
            item
            direction="row"
            justify="space-around"
            alignItems="center"
            wrap="wrap"
            className={classes.buttonContainer}
          >
            <Button
              variant="contained"
              disabled={acceptFunctionInFlight}
              color="primary"
              className={classes.acceptButton}
              onClick={() => {
                window.analytics.track('left chat - connection issues')
                setAcceptFunctionInFlight(true)
                onAcceptClick()
                closeModal()
              }}
            >
              Leave Chat
            </Button>
          </Grid>
        </Grid>
      </Fade>
    </Modal>
  )
}

export default ConnectionIssuesModal
