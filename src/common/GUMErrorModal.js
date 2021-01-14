import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { GUMErrorMessage } from '../utils'

const useStyles = makeStyles((theme) => ({
  modal: {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '55%',
  },
  paper: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    border: '2px solid #8C57DB',
    boxShadow: '4px 4px 0 #8C57DB',
    // padding: theme.spacing(2, 4, 3),
    width: 'auto',
    minWidth: '20vw',
    height: 'auto',
    padding: '40px',
  },
  modalBody: {
    ...theme.typography.modalBody,
    marginBottom: '20px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  buttonContainer: {
    width: '100%',
  },
  pinkHighlight: {
    color: theme.palette.common.basePink,
  },
}))

const GUMErrorModal = ({ onComplete, errorName }) => {
  const classes = useStyles()
  const [open, setOpen] = useState(true)
  const errorMessage = GUMErrorMessage(errorName)

  const handleClose = () => {
    setOpen(false)
    onComplete()
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
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
          <Grid container item justy="center" alignItems="center" className={classes.modalBody}>
            {errorMessage || 'Hey There'}
          </Grid>
          <Grid
            container
            item
            direction="row"
            justify="space-around"
            alignItems="center"
            className={classes.buttonContainer}
          >
            <Button variant="contained" color="primary" size="large" onClick={handleClose}>
              Alright, got it!
            </Button>
          </Grid>
        </Grid>
      </Fade>
    </Modal>
  )
}

export default GUMErrorModal
