import React from 'react'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  boxContainer: {
    width: '100%',
    height: '10vh',
    backgroundColor: 'red',
  },
}))

const BottomControlPanel = () => {
  const classes = useStyles()
  return <div className={classes.boxContainer}> Bottom Control Panel</div>
}

export default BottomControlPanel
