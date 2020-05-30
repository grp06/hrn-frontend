import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '4px',
    boxShadow: '0 0 20px 0 rgba(56, 61, 59, 0.3)',
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
}))

function TransitionModal({ button, modalBody, onAcceptFunction }) {
  const classes = useStyles()
  const { buttonText, buttonVariant, buttonColor, buttonSize } = button
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
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
              {modalBody}
            </Grid>
            {onAcceptFunction && (
              <Grid
                container
                item
                direction="row"
                justify="space-around"
                alignItems="center"
                className={classes.buttonContainer}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    onAcceptFunction()
                    handleClose()
                  }}
                >
                  Yes, I'm Sure
                </Button>
                <Button variant="outlined" color="default" onClick={handleClose}>
                  Woops, No Way!
                </Button>
              </Grid>
            )}
          </Grid>
        </Fade>
      </Modal>
    </div>
  )
}

export default TransitionModal
