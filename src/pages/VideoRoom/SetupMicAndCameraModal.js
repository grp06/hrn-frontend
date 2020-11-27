import React, { useState } from 'react'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

import { SetupMicAndCamera } from '../Lobby'
import { useUserEventStatusContext } from '../../context'

const useStyles = makeStyles((theme) => ({
  acceptButton: {
    margin: theme.spacing(1.5, 0),
  },
  buttonContainer: {
    width: '50%',
    [theme.breakpoints.down('md')]: {
      width: '80%',
    },
  },
  cancelButton: {
    margin: theme.spacing(1.5, 0),
    backgroundColor: theme.palette.common.greyButton,
    color: theme.palette.common.ghostWhite,
    '&:hover': {
      backgroundColor: theme.palette.common.greyButtonHover,
    },
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    ...theme.typography.modalBody,
    marginBottom: '20px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
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
  previewVideo: {
    width: '400px',
    height: 'auto',
    backgroundColor: 'black',
    borderRadius: '4px',
  },
}))

const SetupMicAndCameraModal = ({ open, setOpen }) => {
  const classes = useStyles()
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
