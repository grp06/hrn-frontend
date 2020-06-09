import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { constants } from './'

const {
  firefoxCameraPermissionHowTo,
  chromeCameraPermissionHowTo,
  safariCameraPermissionHowTo,
} = constants

const useStyles = makeStyles((theme) => ({
  header: {
    fontFamily: 'Muli',
    fontSize: '1.7rem',
    marginBottom: '30px',
    textAlign: 'center',
  },
  pinkHighlight: {
    color: theme.palette.common.orchid,
  },
  modalBody: {
    ...theme.typography.modalBody,
    textAlign: 'center',
    marginBottom: '20px',
  },
  aTag: {
    textDecoration: 'none',
    color: theme.palette.common.orchid,
    marginBottom: '10px',
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.common.ghostWhite,
    },
  },
  extraMargin: {
    marginTop: '10px',
  },
}))

const GUMErrorMessage = (errorName) => {
  const classes = useStyles()
  switch (errorName) {
    case 'NotAllowedError':
      return (
        <Grid container direction="column" justify="center" alignItems="center">
          <Typography variant="h2" className={classes.header}>
            Hmmm somethings off 🤔
          </Typography>
          <Typography className={classes.modalBody}>
            It seems that we{' '}
            <span className={classes.pinkHighlight}>
              could not get permission to use your camera or microphone.{' '}
            </span>
            Unfortunately, we need access to your camera and microphone so other people can see your
            pretty face and hear your story or awesome ideas while you network.
          </Typography>
          <Typography className={classes.modalBody}>
            You can follow the links below to help troubleshoot. When you're done with the changes
            make sure to come back here and refresh!
          </Typography>
          <a className={classes.aTag} href={firefoxCameraPermissionHowTo} target="_blank">
            Firefox troubleshoot
          </a>
          <a className={classes.aTag} href={chromeCameraPermissionHowTo} target="_blank">
            Chrome troubleshoot
          </a>
          <a className={classes.aTag} href={safariCameraPermissionHowTo} target="_blank">
            Safari troubleshoot
          </a>
          <Typography className={[classes.modalBody, classes.extraMargin]}>
            And don't worry, your name will be put into the algorithm for the next round. We got you
            👌
          </Typography>
        </Grid>
      )

    case 'NotFoundError':
      return (
        <Grid container direction="column" justify="center" alignItems="center">
          <Typography variant="h2" className={classes.header}>
            Hmmm somethings off 🤔
          </Typography>
          <Typography className={classes.modalBody}>
            It seems that we{' '}
            <span className={classes.pinkHighlight}>could not find an audio or video source. </span>
            Unfortunately, this platform requires both a video and an audio source for you and the
            other participants to get the most out of this event. We're so happy that you wanted to
            be apart of our events though! Try to sign in with a computer that has a webcam and a
            mic.
          </Typography>
        </Grid>
      )

    case 'NotReadableError':
      return (
        <Grid container direction="column" justify="center" alignItems="center">
          <Typography variant="h2" className={classes.header}>
            Hmmm somethings off 🤔
          </Typography>
          <Typography className={classes.modalBody}>
            It seems that we{' '}
            <span className={classes.pinkHighlight}>
              could not read your audio or video source.{' '}
            </span>
            This is a weird one, but it happens sometimes.
          </Typography>
          <Typography className={classes.modalBody}>
            You get this error when a browser window or tab you're currently on hogs up your
            permissions and doesn't want to share 😔. Unfortunately, you've got to choose us or
            them. Don't worry, we won't tell.
          </Typography>
          <Typography className={classes.modalBody}>
            <span className={classes.pinkHighlight}>
              Make sure to come back to the event page and refresh once you're back.
            </span>{' '}
            Refreshing will ensure your name gets thrown into our algorithm for the next round
          </Typography>
        </Grid>
      )
    default:
      return null
  }
}

export default GUMErrorMessage
