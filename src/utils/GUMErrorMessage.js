import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { constants } from '.'

const {
  firefoxCameraPermissionHowTo,
  chromeCameraPermissionHowTo,
  safariCameraPermissionHowTo,
} = constants

const useStyles = makeStyles((theme) => ({
  header: {
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
  pinkHighlight: {
    color: theme.palette.common.sunray,
  },
  modalBody: {
    textAlign: 'center',
    marginBottom: theme.spacing(2.5),
  },
  aTag: {
    textDecoration: 'none',
    color: theme.palette.common.sunray,
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
          <Typography variant="h4" className={classes.header}>
            Hmmm somethings off{' '}
            <span role="img" aria-label="hmm smiley">
              🤔
            </span>
          </Typography>
          <Typography variant="h6" className={classes.modalBody}>
            It seems that we{' '}
            <span className={classes.pinkHighlight}>
              could not get permission to use your camera or microphone.{' '}
            </span>
            We need access to your camera and microphone so other people can see your face and hear
            your story.
          </Typography>
          <Typography variant="h6" className={classes.modalBody}>
            You can follow the links below to help troubleshoot. When you&apos;re done with the
            changes make sure to come back here and refresh!
          </Typography>
          <a
            className={classes.aTag}
            href={firefoxCameraPermissionHowTo}
            target="_blank"
            rel="noopener noreferrer"
          >
            Firefox troubleshoot
          </a>
          <a
            className={classes.aTag}
            href={chromeCameraPermissionHowTo}
            target="_blank"
            rel="noopener noreferrer"
          >
            Chrome troubleshoot
          </a>
          <a
            className={classes.aTag}
            href={safariCameraPermissionHowTo}
            target="_blank"
            rel="noopener noreferrer"
          >
            Safari troubleshoot
          </a>
        </Grid>
      )

    case 'NotFoundError':
      return (
        <Grid container direction="column" justify="center" alignItems="center">
          <Typography variant="h4" className={classes.header}>
            Hmmm somethings off{' '}
            <span role="img" aria-label="hmm smiley">
              🤔
            </span>
          </Typography>
          <Typography variant="h6" className={classes.modalBody}>
            It seems that we{' '}
            <span className={classes.pinkHighlight}>could not find an audio or video source. </span>
            Hi Right Now requires both a video and an audio source for you and the other
            participants to get the most out of this event. We&apos;re so happy that you wanted to
            be apart of our events though! Try to sign in with a computer that has a webcam and a
            mic.
          </Typography>
        </Grid>
      )

    case 'NotReadableError':
      return (
        <Grid container direction="column" justify="center" alignItems="center">
          <Typography variant="h4" className={classes.header}>
            Hmmm somethings off{' '}
            <span role="img" aria-label="hmm smiley">
              🤔
            </span>
          </Typography>
          <Typography variant="h6" className={classes.modalBody}>
            It seems that we{' '}
            <span className={classes.pinkHighlight}>
              could not read your audio or video source.{' '}
            </span>
            This is a weird one, but it happens sometimes.
          </Typography>
          <Typography variant="h6" className={classes.modalBody}>
            You get this error when a browser window or tab you&apos;re currently on hogs up your
            permissions and doesn&apos;t want to share{' '}
            <span role="img" aria-label="dissapointed smiley">
              😔
            </span>
            . Unfortunately, you&apos;ve got to choose us or them. Don&apos;t worry, we won&apos;t
            tell.
          </Typography>
          <Typography variant="h6" className={classes.modalBody}>
            <span className={classes.pinkHighlight}>
              Make sure to come back to the event page and refresh once you&apos;re back.
            </span>{' '}
            Refreshing will ensure your name gets thrown in for the next round
          </Typography>
        </Grid>
      )
    default:
      return null
  }
}

export default GUMErrorMessage
