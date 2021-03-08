import React from 'react'

import { Grid } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import { useEventStyles } from '.'
import { SetupMicAndCamera } from '../Lobby'
import { TransitionModal } from '../../common'

const SetupMicAndCameraButton = ({ setUserHasEnabledCameraAndMic }) => {
  const classes = useEventStyles()
  const iconButton = {
    iconButtonIcon: <SettingsIcon style={{ color: 'ghostWhite', fontSize: '2rem' }} />,
    iconButtonColor: 'inherit',
    iconButtonSize: 'small',
  }

  return (
    <TransitionModal
      iconButton={iconButton}
      modalBody={
        <Grid container direction="column" justify="center" alignItems="center">
          <video autoPlay id="videoElement" muted className={classes.previewVideo} />
          <SetupMicAndCamera />
        </Grid>
      }
      onAcceptButtonText="Done"
      onAcceptFunction={async () => {
        window.analytics.track('Opened test camera')
        const video = document.getElementById('videoElement')
        setUserHasEnabledCameraAndMic(true)
        if (video) {
          video.remove()
        }
      }}
      hideNoWay
    />
  )
}

export default SetupMicAndCameraButton
