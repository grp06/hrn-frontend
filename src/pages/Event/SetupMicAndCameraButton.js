import React from 'react'

import Grid from '@material-ui/core/Grid'
import SettingsIcon from '@material-ui/icons/Settings'
import { SetupMicAndCamera } from '../Lobby'
import { TransitionModal } from '../../common'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  previewVideo: {
    width: '400px',
    height: 'auto',
    backgroundColor: 'black',
    borderRadius: '4px',
  },
}))

const SetupMicAndCameraButton = ({ setUserHasEnabledCameraAndMic }) => {
  const classes = useStyles()
  const fabButton = {
    fabButtonIcon: <SettingsIcon style={{ color: '#8C57DB' }} />,
    fabButtonSize: 'small',
    fabButtonColor: 'inherit',
  }

  return TransitionModal({
    fabButton,
    modalBody: (
      <Grid container direction="column" justify="center" alignItems="center">
        <video autoPlay id="videoElement" muted className={classes.previewVideo} />
        <SetupMicAndCamera />
      </Grid>
    ),
    onAcceptButtonText: 'Done',
    onAcceptFunction: async () => {
      window.analytics.track('Opened test camera')
      const video = document.getElementById('videoElement')
      setUserHasEnabledCameraAndMic(true)
      if (video) {
        video.remove()
      }
    },
    hideNoWay: true,
  })
}

export default SetupMicAndCameraButton
