import React from 'react'
import Lottie from 'react-lottie'
import { makeStyles } from '@material-ui/core/styles'
import * as animationData from '../assets/orchidLoadingCircle.json'

import loading from '../assets/loading.gif'

const useStyles = makeStyles((theme) => ({
  loadingWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
}))

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
}

const Loading = () => {
  const classes = useStyles()
  return (
    <div className={classes.loadingWrapper}>
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  )
}
export default Loading
