import React, { useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

interface SnackProps {
  anchorOrigin?: any // getting crazy errors if i try to figure this out
  duration?: number
  onClose: Function
  open: boolean
  severity?: string
  snackIcon?: React.ReactNode
  snackMessage: string
}

const Alert = (props: any) => <MuiAlert elevation={6} variant="filled" {...props} />

const Snack: React.FC<SnackProps> = ({
  open,
  anchorOrigin,
  snackMessage,
  snackIcon,
  duration,
  onClose,
  severity,
}) => {
  const [showSnack, setShowSnack] = useState(false)

  const handleOnClose = (event: object, reason: string) => {
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
