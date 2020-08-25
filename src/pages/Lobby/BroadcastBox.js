import React from 'react'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  boxContainer: {
    width: '100%',
    height: '80vh',
    backgroundColor: 'blue',
  },
}))

const BroadcastBox = () => {
  const classes = useStyles()
  return <div className={classes.boxContainer}> Broadcast Box</div>
}

export default BroadcastBox
