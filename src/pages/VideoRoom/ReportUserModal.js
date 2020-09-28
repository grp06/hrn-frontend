import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Typography from '@material-ui/core/Typography'
import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import { makeStyles } from '@material-ui/core/styles'

import { updateLeftChat, reportPartner } from '../../gql/mutations'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    border: '2px solid #6638aa',
    boxShadow: '4px 4px 0 #6638aa',
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
  cancelButton: {
    margin: theme.spacing(1.5, 0),
    backgroundColor: theme.palette.common.greyButton,
    color: theme.palette.common.ghostWhite,
    '&:hover': {
      backgroundColor: theme.palette.common.greyButtonHover,
    },
  },
}))

const ReportUserModal = ({ myRound, open, setOpen }) => {
  const { event_id, id: row_id, user_id, partner_id, created_at: convo_started_at } = myRound
  const classes = useStyles()
  const [openModal, setOpenModal] = useState(open)
  const [acceptFunctionInFlight, setAcceptFunctionInFlight] = useState(false)

  const [updateLeftChatMutation] = useMutation(updateLeftChat, {
    variables: {
      row_id,
      reason: 'reported my partner',
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
      window.location.reload()
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
            <Typography variant="h5" gutterBottom>
              Report this user?{' '}
              <span role="img" aria-label="mad face">
                🤬
              </span>
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              We take pride in only allowing high-quality, respectful people on our platform and
              therefore we do not take users being rude lightly. We appreciate you flagging this
              conversation and we may reach out to you to investigate this report.
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
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
