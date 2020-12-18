import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import Backdrop from '@material-ui/core/Backdrop'
import Button from '@material-ui/core/Button'
import Fade from '@material-ui/core/Fade'
import Grid from '@material-ui/core/Grid'
import Modal from '@material-ui/core/Modal'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'
import { useAppContext, useUserContext } from '../../context'

const useStyles = makeStyles((theme) => ({
  acceptButton: {
    backgroundColor: theme.palette.common.sunray,
    '&:hover': {
      backgroundColor: '#FCD08C',
    },
  },
  cancelButton: {
    margin: theme.spacing(1.5, 0),
    backgroundColor: theme.palette.common.greyButton,
    color: theme.palette.common.ghostWhite,
    '&:hover': {
      backgroundColor: theme.palette.common.greyButtonHover,
    },
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    border: '2px solid #fabb5b',
    boxShadow: '4px 4px 0 #fabb5b',
    width: '55vw',
    minWidth: '20vw',
    height: 'auto',
    padding: '40px',
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
    },
  },
  modalBody: {
    ...theme.typography.modalBody,
    marginBottom: '20px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
  },
  modalHeader: {
    marginBottom: theme.spacing(3),
  },
  highlightText: {
    color: theme.palette.common.ghostWhite,
    fontWeight: '300',
    backgroundColor: theme.palette.common.basePurple,
    borderRadius: '4px',
    padding: theme.spacing(0.2, 1),
  },
  buttonContainer: {
    width: '50%',
    [theme.breakpoints.down('md')]: {
      width: '80%',
    },
  },
}))

const ProfilePictureModal = () => {
  const classes = useStyles()
  const history = useHistory()
  const { appLoading } = useAppContext()
  const { user } = useUserContext()
  const { id: userId, profile_pic_url } = user
  const [showModal, setShowModal] = useState(true)
  const EventHomeRegex = /\/events\/\d+/
  const EventInProgressRegex = /\/events\/\d+\//

  const onEventsPage = window.location.pathname === '/events'
  const onEventHomePage = Boolean(window.location.pathname.match(EventHomeRegex))
  const onEventInProgressPage = Boolean(window.location.pathname.match(EventInProgressRegex))
  const haveShownProfilePicModal = localStorage.getItem('haveShownProfilePicModal')

  const showProfilePicModal =
    userId &&
    !haveShownProfilePicModal &&
    !profile_pic_url &&
    (onEventsPage || onEventHomePage) &&
    !onEventInProgressPage

  useEffect(() => {
    if (showProfilePicModal) {
      return setShowModal(true)
    }
    setShowModal(false)
  }, [onEventInProgressPage, showProfilePicModal])

  if (appLoading || !showProfilePicModal) {
    return null
  }

  const handleCloseModal = () => {
    localStorage.setItem('haveShownProfilePicModal', true)
    setShowModal(false)
  }

  const handleAcceptClick = () => {
    handleCloseModal()
    history.push('/my-profile')
  }

  return (
    showProfilePicModal && (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={showModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showModal}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            className={classes.paper}
          >
            <Grid container justify="center" className={classes.modalBody}>
              <Typography variant="h3" className={classes.modalHeader}>
                Show us that beautiful face of yours{' '}
                <span role="img" aria-label="cat love">
                  😻
                </span>
              </Typography>
              <Typography variant="subtitle1">
                We&apos;re excited to have recently rolled out profile pictures throughout the app!
              </Typography>
              <Typography variant="subtitle1">
                Not everyone is good with remembering names{' '}
                <span role="img" aria-label="sad boy">
                  🙇‍♂️
                </span>
                . Help your past connections recognize you after the event by uploading your best
                selfie.
              </Typography>
            </Grid>
            <Grid
              container
              item
              direction="row"
              justify="space-around"
              alignItems="center"
              wrap="wrap"
              className={classes.buttonContainer}
            >
              <Button
                variant="contained"
                size="large"
                color="default"
                className={classes.acceptButton}
                onClick={() => {
                  handleAcceptClick()
                }}
              >
                Let&apos;s Go!
              </Button>
              <Button
                variant="contained"
                size="large"
                className={classes.cancelButton}
                onClick={() => {
                  handleCloseModal()
                }}
              >
                No Thanks
              </Button>
            </Grid>
          </Grid>
        </Fade>
      </Modal>
    )
  )
}

export default ProfilePictureModal
