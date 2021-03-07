import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import FeatherIcon from 'feather-icons-react'
import copy from 'copy-to-clipboard'
import debounce from 'lodash.debounce'
import { useHistory } from 'react-router-dom'
import { Button, CircularProgress, Grid, Typography } from '@material-ui/core'
import { DeleteEventButton, useEventStyles } from '.'
import { CalendarIconIcs, Snack } from '../../common'
import { insertEventUser } from '../../gql/mutations'
import { formatDate, rsvpForEvent } from '../../utils'

const EventTitleAndCTACard = React.memo(({ event, user }) => {
  const classes = useEventStyles()
  const history = useHistory()
  const [showCopyURLSnack, setCopyURLSnack] = useState(false)
  const [showComeBackSnack, setShowComeBackSnack] = useState(false)
  const [rsvpButtonLoading, setRsvpButtonLoading] = useState(false)
  const { email: usersEmail, id: user_id, name: usersName } = user
  const { event_name, event_users, host_id, id: eventId, start_at, status: event_status } = event
  const userIsHost = parseInt(host_id, 10) === parseInt(user_id, 10)
  const startTime = new Date(start_at).getTime()
  const userAlreadyRSVPed = event_users?.find((u) => u.user.id === user_id)
  const { pathname } = window.location
  const userIsOnLobbyPage = Boolean(pathname.includes('lobby'))
  const userIsOnEventCompletePage = Boolean(pathname.includes('event-complete'))
  const editFormButtonColor = userIsOnLobbyPage ? 'default' : 'primary'

  const [insertEventUserMutation] = useMutation(insertEventUser, {
    variables: {
      event_id: eventId,
      user_id,
    },
  })

  const getUserCTAButtonText = () => {
    if (userAlreadyRSVPed && event_status === 'not-started') return "You're all set!"
    else if (
      !rsvpButtonLoading &&
      !userAlreadyRSVPed &&
      event_status !== 'not-started' &&
      event_status !== 'complete'
    )
      return 'Join Event'
    else if (rsvpButtonLoading) return 'Loading'
    return 'RSVP'
  }

  const handleRSVPClick = async () => {
    setRsvpButtonLoading(true)
    if (!user_id) {
      localStorage.setItem('eventId', eventId)
      history.push('/sign-up')
    } else {
      if (!userAlreadyRSVPed) {
        await rsvpForEvent(event, insertEventUserMutation, usersEmail, usersName)
      }
    }
    setRsvpButtonLoading(false)
  }

  const handleAllSetClick = () => {
    setShowComeBackSnack(true)
  }

  const handleShareEventClick = () => {
    copy(window.location.href)
    setCopyURLSnack(true)
  }

  const renderRSVPOrEditButton = () => {
    if (userIsHost && event_status === 'not-started') {
      return (
        <Button
          variant="contained"
          size="large"
          color="primary"
          disableRipple
          onClick={() => history.push(`/create-event?eventId=${eventId}`)}
        >
          Edit Event
        </Button>
      )
    }
    if (userIsOnLobbyPage && userAlreadyRSVPed) {
      return null
    }
    return (
      <Button
        variant="contained"
        size="large"
        color={userAlreadyRSVPed ? 'secondary' : 'primary'}
        disableRipple
        disabled={rsvpButtonLoading}
        startIcon={rsvpButtonLoading ? <CircularProgress size={20} /> : null}
        onClick={userAlreadyRSVPed ? handleAllSetClick : debounce(handleRSVPClick, 250)}
      >
        {getUserCTAButtonText()}
      </Button>
    )
  }

  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="flex-end"
      className={classes.eventTitleAndCTACardContainer}
    >
      <Grid container item xs={12} lg={8} direction="column">
        <Typography variant="h1">{event_name}</Typography>
        <Grid item container direction="row" alignItems="center">
          <CalendarIconIcs event={event} />
          <Typography variant="body1" className={classes.eventDateTypography}>
            {formatDate(startTime)}
          </Typography>
        </Grid>
      </Grid>
      {(userAlreadyRSVPed && event_status !== 'not-started' && event_status !== 'complete') ||
      userIsOnEventCompletePage ? null : (
        <Grid
          container
          item
          xs={12}
          lg={4}
          direction="row"
          justify="flex-end"
          alignItems="flex-end"
          className={classes.ctaCardButtonContainer}
        >
          <Button
            variant="outlined"
            size="large"
            className={classes.shareEventButton}
            onClick={handleShareEventClick}
          >
            <FeatherIcon icon="share-2" stroke="#f4f6fa" size="30" />
          </Button>
          {userIsHost ? <DeleteEventButton eventId={eventId} /> : null}
          {renderRSVPOrEditButton()}
        </Grid>
      )}
      <Snack
        open={showCopyURLSnack}
        duration={1800}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setCopyURLSnack(false)}
        severity="info"
        snackMessage="Event URL Copied 💾"
      />
      <Snack
        open={showComeBackSnack}
        duration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setShowComeBackSnack(false)}
        severity="info"
        snackMessage="To attend this event, come back to this page 5 minutes before the event starts ⏰"
      />
    </Grid>
  )
})
export default EventTitleAndCTACard
