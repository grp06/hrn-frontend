import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import Backdrop from '@material-ui/core/Backdrop'

const useStyles = makeStyles((theme) => ({
  loadingWrapper: {
    width: '100%',
    height: '100vh',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}))

const Loading = () => {
  const classes = useStyles()
  return (
    <Backdrop className={classes.backdrop} open={true}>
      <div className={classes.root}>
        <LinearProgress />
      </div>
    </Backdrop>
  )
}
export default Loading
