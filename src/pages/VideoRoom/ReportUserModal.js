import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'

import { Backdrop, Button, Fade, Grid, Modal, Typography } from '@material-ui/core'

import { useHistory } from 'react-router-dom'
import { useTwilioContext, useUserEventStatusContext } from '../../context'
import { updateLeftChat, reportPartner } from '../../gql/mutations'
import { useVideoRoomStyles } from '.'

const ReportUserModal = ({ myRound, open, setOpen }) => {
  const { event_id, id: row_id, user_id, partner_id, created_at: convo_started_at } = myRound
  const classes = useVideoRoomStyles()
  const history = useHistory()
  const { setUserEventStatus } = useUserEventStatusContext()
  const { setMyRound } = useTwilioContext()
  const [openModal, setOpenModal] = useState(open)
  const [acceptFunctionInFlight, setAcceptFunctionInFlight] = useState(false)

  const [updateLeftChatMutation] = useMutation(updateLeftChat, {
    variables: {
      row_id,
      reason: 'reported my partner',
      rating: 0,
    },
  })

  const [reportPartnerMutation] = useMutation(reportPartner, {
    variables: {
      user_id,
      partner_id,
      reason: 'default',
      convo_started_at,
      event_id,
    },
  })

  const closeModal = () => {
    setOpenModal(false)
    setOpen(false)
  }

  const exitChat = async () => {
    try {
      await updateLeftChatMutation()
      await reportPartnerMutation()
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
              Report this user?{' '}
              <span role="img" aria-label="mad face">
                🤬
              </span>
            </Typography>
            <Typography variant="body1" gutterBottom>
              We take pride in only allowing high-quality, respectful people on our platform and
              therefore we do not take users being rude lightly. We appreciate you flagging this
              conversation and we may reach out to you to investigate this report.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Are you sure you would like to report this user?
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
                window.analytics.track('reported partner')
                setAcceptFunctionInFlight(true)
                onAcceptClick()
                closeModal()
              }}
            >
              Report this user
            </Button>
            <Button variant="outlined" className={classes.cancelButton} onClick={closeModal}>
              Whoops, No Way!
            </Button>
          </Grid>
        </Grid>
      </Fade>
    </Modal>
  )
}

export default ReportUserModal
