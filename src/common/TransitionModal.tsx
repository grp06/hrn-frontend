// @ts-nocheck
import React, { useState } from 'react'
import { Backdrop, Button, Fade, Grid, IconButton, Modal } from '@material-ui/core'
import { useCommonComponentStyles } from '.'
import { TransitionModalInterface } from '../utils'

const TransitionModal: React.FC<TransitionModalInterface> = ({
  button,
  disabled,
  iconButton,
  hideNoWay,
  modalBody,
  onAcceptFunction,
  onAcceptButtonText,
  onCloseFunction,
  onCloseButtonText,
}) => {
  console.log('hiii im the transiton Modal')
  const classes = useCommonComponentStyles()
  const { buttonText, buttonVariant, buttonColor, buttonSize, buttonStyle } = button || {}
  const { iconButtonColor, iconButtonSize, iconButtonIcon } = iconButton || {}
  const [open, setOpen] = useState(false)
  const [acceptFunctionInFlight, setAcceptFunctionInFlight] = useState(false)

  const closeModal = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
    setAcceptFunctionInFlight(false)
  }

  const handleClose = () => {
    setOpen(false)
    if (onCloseFunction) {
      onCloseFunction()
    }
  }

  const renderButton = () => {
    if (iconButton) {
      return (
        <IconButton
          disableRipple
          size={iconButtonSize || 'medium'}
          color={iconButtonColor || 'primary'}
          onClick={handleOpen}
        >
          {iconButtonIcon}
        </IconButton>
      )
    }
    return (
      <Button
        disableRipple
        size={buttonSize || 'large'}
        variant={buttonVariant || 'contained'}
        color={buttonColor || 'primary'}
        onClick={handleOpen}
        style={buttonStyle}
        disabled={disabled}
      >
        {buttonText}
      </Button>
    )
  }

  return (
    <div>
      {renderButton()}
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
              {modalBody}
            </Grid>
            {onAcceptFunction && (
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
                    onAcceptFunction()
                    closeModal()
                  }}
                >
                  {onAcceptButtonText || 'Yes, I am Sure'}
                </Button>
                {!hideNoWay && (
                  <Button
                    variant="contained"
                    size="large"
                    className={classes.modalCancelButton}
                    onClick={handleClose}
                  >
                    {onCloseButtonText || 'Whoops, No Way!'}
                  </Button>
                )}
              </Grid>
            )}
          </Grid>
        </Fade>
      </Modal>
    </div>
  )
}

export default TransitionModal
