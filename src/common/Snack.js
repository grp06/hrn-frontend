import React, { useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />

const Snack = ({ open, anchorOrigin, snackMessage, snackIcon, duration, onClose, severity }) => {
  const [showSnack, setShowSnack] = useState(false)

  const handleOnClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    if (onClose) {
      onClose()
    }
    setShowSnack(false)
  }

  return (
    <Snackbar
      open={open || showSnack}
      anchorOrigin={anchorOrigin || { vertical: 'top', horizontal: 'center' }}
      autoHideDuration={duration || 3000}
      onClose={handleOnClose}
    >
      <Alert onClose={handleOnClose} severity={severity || 'success'} icon={snackIcon}>
        {snackMessage}
      </Alert>
    </Snackbar>
  )
}

export default Snack
