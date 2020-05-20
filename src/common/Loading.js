import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import loading from '../assets/loading.gif'

const useStyles = makeStyles((theme) => ({
  loadingWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
}))

const Loading = () => {
  const classes = useStyles()

  return (
    <div className={classes.loadingWrapper}>
      <img src={loading} alt="loading gif" />
    </div>
  )
}
export default Loading
