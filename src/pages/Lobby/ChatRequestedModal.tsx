import React, { useState } from 'react'
import { Backdrop, Button, Fade, Grid, Modal, Typography } from '@material-ui/core'
import { useLobbyStyles } from '.'

export interface ChatRequestedModalProps {}

const ChatRequestedModal: React.FC<ChatRequestedModalProps> = () => {
  const classes = useLobbyStyles()
  const [open, setOpen] = useState<boolean>(false)
  const [acceptFunctionInFlight, setAcceptFunctionInFlight] = useState<boolean>(false)

  const closeModal = () => {
    setOpen(false)
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modalContainer}
      open={open}
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
          className={classes.modalPaper}
        >
          <Grid container justify="center" className={classes.modalBody}>
            <Typography variant="h2">Im the modal bishhhh</Typography>
          </Grid>
          <Grid
            container
            item
            direction="row"
            justify="space-around"
            alignItems="center"
            wrap="wrap"
            className={classes.modalButtonContainer}
          >
            <Button
              variant="contained"
              disabled={acceptFunctionInFlight}
              size="large"
              color="primary"
              className={classes.modalAcceptButton}
              onClick={() => {
                setAcceptFunctionInFlight(true)
                // onAcceptFunction()
                closeModal()
              }}
            >
              Yes, I am Sure
            </Button>
            <Button
              variant="contained"
              size="large"
              className={classes.modalCancelButton}
              onClick={closeModal}
            >
              Whoops, No Way!
            </Button>
          </Grid>
        </Grid>
      </Fade>
    </Modal>
  )
}

export default ChatRequestedModal
