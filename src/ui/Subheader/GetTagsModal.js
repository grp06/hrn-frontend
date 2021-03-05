import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import Backdrop from '@material-ui/core/Backdrop'
import Button from '@material-ui/core/Button'
import Fade from '@material-ui/core/Fade'
import Grid from '@material-ui/core/Grid'
import Modal from '@material-ui/core/Modal'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'
import { useUserContext } from '../../context'

const useStyles = makeStyles((theme) => ({
  acceptButton: {
    backgroundColor: theme.palette.common.sunray,
    '&:hover': {
      backgroundColor: '#FCD08C',
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

const GetTagsModal = () => {
  const classes = useStyles()
  const history = useHistory()
  const { user, userContextLoading } = useUserContext()
  const { tags_users: usersTags, id: userId } = user
  const [showModal, setShowModal] = useState(true)
  const EventHomeRegex = /\/events\/\d+/
  const EventInProgressRegex = /\/events\/\d+\//

  const onEventsPage = window.location.pathname === '/events'
  const onEventHomePage = Boolean(window.location.pathname.match(EventHomeRegex))
  const onEventInProgressPage = Boolean(window.location.pathname.match(EventInProgressRegex))

  const showGetTagsModal =
    userId &&
    usersTags &&
    usersTags.length < 3 &&
    (onEventsPage || onEventHomePage) &&
    !onEventInProgressPage

  useEffect(() => {
    if (showGetTagsModal) {
      return setShowModal(true)
    }
    setShowModal(false)
  }, [onEventsPage, onEventHomePage, onEventInProgressPage, showGetTagsModal])

  if (userContextLoading || !showGetTagsModal) {
    return null
  }

  const handleModalButtonClick = () => {
    history.push('/my-profile')
    setShowModal(false)
  }

  return (
    showGetTagsModal && (
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
                We want to get to know you a bit more{' '}
                <span role="img" aria-label="excited smiley">
                  🤗
                </span>
              </Typography>
              <Typography variant="subtitle1">
                We&apos;re so excited to be introducing our new matching algorithm that makes
                matches even more relevant to you!
              </Typography>
              <Typography variant="subtitle1">
                However, we see that you don&apos;t have enough tags to properly feed our algorithm.
              </Typography>
              <Typography variant="subtitle1">
                Please go and choose a few more tags before the event starts!
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
                color="default"
                className={classes.acceptButton}
                onClick={() => {
                  handleModalButtonClick()
                }}
              >
                Let&apos;s Go!
              </Button>
            </Grid>
          </Grid>
        </Fade>
      </Modal>
    )
  )
}

export default GetTagsModal
