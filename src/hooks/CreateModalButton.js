import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Button from '@material-ui/core/Button'

function rand() {
  return Math.round(Math.random() * 20) - 10
}

function getModalStyle() {
  const top = 50 + rand()
  const left = 50 + rand()

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    borderRadius: '4px',
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  modalContentContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  modalTitle: {
    ...theme.typography.h2,
    marginBottom: '0px',
  },
  modalDescription: {
    ...theme.typography.body,
  },
  buttonContainer: {
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  acceptButton: {
    ...theme.typography.headerButton,
  },
}))

const CreateModalButton = ({ button, modalBody, onAcceptFunction }) => {
  const classes = useStyles()
  const { buttonText, buttonVariant, buttonColor, buttonSize } = button
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle)
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className={classes.modalContentContainer}>
        {modalBody}
        {onAcceptFunction && (
          <>
            <Button variant="contained" color="primary" onClick={onAcceptFunction}>
              Yes, I'm Sure
            </Button>
            <Button variant="outlined" color="default" onClick={handleClose}>
              Woops, No Way!
            </Button>
          </>
        )}
      </div>

      {/* <CreateModalButton {...props} /> */}
    </div>
  )

  return (
    <div>
      {/* <Fab color="secondary" aria-label="edit" onClick={handleOpen}>
        <EditIcon />
      </Fab> */}
      <Button
        disableRipple
        size={buttonSize || 'small'}
        variant={buttonVariant || 'contained'}
        color={buttonColor || 'primary'}
        onClick={handleOpen}
      >
        {buttonText}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  )
}

export default CreateModalButton
