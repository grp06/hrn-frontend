import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FeatherIcon from 'feather-icons-react'
import copy from 'copy-to-clipboard'
import { useMutation } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { EventForm, Snack, TransitionModal } from '../../common'
import { insertEventUser, deleteEventUser } from '../../gql/mutations'
import { formatDate, rsvpForEvent } from '../../utils'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  rsvpOrEditButton: {
    width: '70%',
  },
  shareEventButton: {
    backgroundColor: theme.palette.common.greyButton,
    '&:hover': {
      backgroundColor: theme.palette.common.greyHighlight,
    },
  },
  subtitle: {
    margin: theme.spacing(1),
    marginBottom: '10px',
    width: '75%',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
  },
}))

const EventTitleAndCTACard = React.memo(({ event, user }) => {
  const classes = useStyles()
  const history = useHistory()
  const [showCopyURLSnack, setCopyURLSnack] = useState(false)
  const { email: usersEmail, id: user_id, name: usersName } = user
  const { event_name, event_users, host_id, id: event_id, start_at } = event
  const userIsHost = parseInt(host_id, 10) === parseInt(user_id, 10)
  const startTime = new Date(start_at).getTime()
  const userAlreadyRSVPed = event_users.find((u) => u.user.id === user_id)

  const [insertEventUserMutation] = useMutation(insertEventUser, {
    variables: {
      event_id,
      user_id,
    },
  })

  const [deleteEventUserMutation] = useMutation(deleteEventUser, {
    variables: {
      event_id,
      user_id,
    },
  })

  const editFormModal = TransitionModal({
    modalBody: <EventForm eventData={event} />,
    button: {
      buttonColor: 'primary',
      buttonVariant: 'contained',
      buttonSize: 'large',
      buttonStyle: { width: '100%' },
      buttonText: 'Edit Event',
    },
  })

  const handleCancelRSVPClick = async () => {
    try {
      await deleteEventUserMutation()
      window.analytics.track('RSVP cancelled')
    } catch (error) {
      console.log('error = ', error)
    }
  }

  const handleRSVPClick = () => {
    if (!user_id) {
      localStorage.setItem('eventId', event_id)
      history.push('/sign-up')
    } else {
      rsvpForEvent(event, insertEventUserMutation, usersEmail, usersName)
    }
  }

  const handleShareEventClick = () => {
    copy(window.location.href)
    setCopyURLSnack(true)
  }

  const renderRSVPOrEditButton = () => {
    if (userIsHost) {
      return <div className={classes.rsvpOrEditButton}>{editFormModal}</div>
    }
    return (
      <Button
        variant="contained"
        size="large"
        color="primary"
        className={classes.rsvpOrEditButton}
        onClick={userAlreadyRSVPed ? handleCancelRSVPClick : handleRSVPClick}
      >
        {userAlreadyRSVPed ? 'Cancel RSVP' : 'RSVP'}
      </Button>
    )
  }

  return (
    <Grid container direction="row" justify="space-between" alignItems="center">
      <Grid container item xs={12} md={9} direction="column">
        <Typography variant="h3">{event_name}</Typography>
        <Grid item container direction="row" alignItems="center">
          <FeatherIcon icon="calendar" stroke="#e98dd7" size="24" />
          <Typography variant="subtitle1" className={classes.subtitle}>
            {formatDate(startTime)}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        item
        xs={12}
        md={3}
        direction="row"
        justify="space-between"
        alignItems="flex-end"
      >
        <Button
          variant="contained"
          size="large"
          className={classes.shareEventButton}
          onClick={handleShareEventClick}
        >
          <FeatherIcon icon="share-2" stroke="#f4f6fa" size="30" />
        </Button>
        {renderRSVPOrEditButton()}
      </Grid>
      <Snack
        open={showCopyURLSnack}
        duration={1800}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={() => setCopyURLSnack(false)}
        severity="info"
        snackMessage={
          <div>
            Event URL Copied{' '}
            <span role="img" aria-label="floppy disk">
              💾
            </span>
          </div>
        }
      />
    </Grid>
  )
})
export default EventTitleAndCTACard
