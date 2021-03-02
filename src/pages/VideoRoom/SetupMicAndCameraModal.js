import React, { useState } from 'react'
import { Backdrop, Button, Fade, Grid, Modal } from '@material-ui/core'
import { SetupMicAndCamera } from '../Lobby'
import { useUserEventStatusContext } from '../../context'
import { useVideoRoomStyles } from '.'

const SetupMicAndCameraModal = ({ open, setOpen }) => {
  const classes = useVideoRoomStyles()
  const { setUserHasEnabledCameraAndMic } = useUserEventStatusContext()
  const [openModal, setOpenModal] = useState(open)
  const [acceptFunctionInFlight, setAcceptFunctionInFlight] = useState(false)

  const closeModal = () => {
    setOpenModal(false)
    setOpen(false)
  }

  const onAcceptClick = () => {
    window.analytics.track('Opened test camera')
    const video = document.getElementById('videoElement')
    setUserHasEnabledCameraAndMic()
    if (video) {
      video.remove()
    }
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
            <video autoPlay id="videoElement" muted className={classes.previewVideo} />
            <SetupMicAndCamera />
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
                setAcceptFunctionInFlight(true)
                onAcceptClick()
                closeModal()
              }}
            >
              Done
            </Button>
            <Button variant="outlined" className={classes.cancelButton} onClick={closeModal}>
              Whoops, Nevermind!
            </Button>
          </Grid>
        </Grid>
      </Fade>
    </Modal>
  )
}

export default SetupMicAndCameraModal
