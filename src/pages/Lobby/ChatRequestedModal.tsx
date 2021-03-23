import React, { useState } from 'react'
import { Avatar, Backdrop, Button, Fade, Grid, Modal, Typography } from '@material-ui/core'
import { useLobbyStyles } from '.'
import logo from '../../assets/HRNlogoNoFrame.svg'
import { PartnersObjectInterface } from '../../utils'

export interface ChatRequestedModalProps {
  chatWasRequested: PartnersObjectInterface
}

const ChatRequestedModal: React.FC<ChatRequestedModalProps> = ({ chatWasRequested }) => {
  const classes = useLobbyStyles()
  const { partner } = chatWasRequested
  const { city: partnersCity, name: partnersName, profile_pic_url: partnersPicURL } = partner
  const [open, setOpen] = useState<boolean>(true)
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
            <Typography variant="h3">
              Someone wants to chat with you{' '}
              <span role="img" aria-label="man dancing">
                🕺
              </span>
            </Typography>
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="center"
              style={{ marginTop: '16px' }}
            >
              <Avatar className={classes.chatRequestedPartnerAvatarContainer}>
                <img
                  alt="partners-photo"
                  src={partnersPicURL || logo}
                  className={classes.chatRequestedPartnerAvatar}
                />
              </Avatar>
              <Grid
                container
                direction="column"
                alignItems="flex-start"
                justify="flex-start"
                style={{ width: 'auto', marginLeft: '12px' }}
              >
                <Typography variant="h4">{partnersName}</Typography>
                <Typography variant="body1">{partnersCity}</Typography>
              </Grid>
            </Grid>
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
