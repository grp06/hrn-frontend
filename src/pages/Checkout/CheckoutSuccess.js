import React from 'react'
import Lottie from 'react-lottie'
import { makeStyles } from '@material-ui/core/styles'

import * as successStars from '../../assets/successStars.json'

const useStyles = makeStyles((theme) => ({
  backgroundLottie: {
    position: 'absolute',
    width: '400px',
    height: '400px',
  },
}))

const CheckoutSuccess = () => {
  const classes = useStyles()
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: successStars.default,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }
  return (
    <div>
      <div className={classes.backgroundLottie}>
        <Lottie options={defaultOptions} height="100%" width="100%" />
      </div>
    </div>
  )
}

export default CheckoutSuccess
