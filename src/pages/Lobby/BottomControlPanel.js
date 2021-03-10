import React from 'react'
import { Badge, Grid, IconButton, Typography } from '@material-ui/core'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble'
import { PreEventInstructionModal, useLobbyStyles } from '.'
import { TransitionModal } from '../../common'
import { SetupMicAndCameraButton, StartPreEventButton } from '../Event'
import { startEvent } from '../../helpers'
import { StartEventButton } from '../PreEvent'
import { getTimeUntilEvent } from '../../utils'

const BottomControlPanel = ({
  chatIsOpen,
  event,
  numberOfUnreadChatMessages,
  setUserHasEnabledCameraAndMic,
  toggleChat,
  userId,
  userHasEnabledCameraAndMic,
}) => {
  const classes = useLobbyStyles()
  const { start_at: eventStartTime, id: eventId, host_id, status: eventStatus } = event
  const timeUntilEvent = getTimeUntilEvent(eventStartTime)
  const userIsHost = host_id === userId

  const renderResetEvent = (
    <TransitionModal
      button={{
        buttonText: 'Reset Event',
        buttonVariant: 'text',
        buttonColor: 'link',
      }}
      modalBody={
        <Typography variant="h3">
          This will reset the event in its entirety. Are you 100% sure?
        </Typography>
      }
      onAcceptFunction={async () => {
        window.analytics &&
          window.analytics.track('Event reset', {
            eventId,
            hostId: host_id,
          })
        await startEvent({ eventId, num_rounds: null, round_length: null, reset: true })
      }}
    />
  )

  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="center"
      wrap="nowrap"
      className={classes.bottomControlPanelContainer}
    >
      {userIsHost && eventStatus === 'not-started' && (
        <Grid container direction="column">
          <Grid container direction="row" alignItems="flex-end">
            <StartPreEventButton
              disabled={!userHasEnabledCameraAndMic}
              eventId={eventId}
              timeUntilEvent={timeUntilEvent}
            />
            <PreEventInstructionModal />
          </Grid>
        </Grid>
      )}
      {userIsHost && eventStatus === 'pre-event' && (
        <Grid container direction="column">
          <Grid container direction="row" alignItems="flex-end">
            <StartEventButton event={event} userId={userId} />
          </Grid>
        </Grid>
      )}
      {!userIsHost && eventStatus === 'pre-event' && (
        <Grid container direction="column">
          <Grid container direction="row" alignItems="flex-end">
            <Typography variant="body1">
              Welcome Remarks from the Host. We will match you shortly.{' '}
              <span role="img" aria-label="celebrating face">
                🥳
              </span>
            </Typography>
          </Grid>
        </Grid>
      )}
      {userIsHost && (eventStatus === 'in-between-rounds' || eventStatus === 'room-in-progress') && (
        <Grid container direction="column">
          <Grid container direction="row" alignItems="flex-end">
            {renderResetEvent}
          </Grid>
        </Grid>
      )}
      <Grid
        container
        justify="flex-end"
        alignItems="center"
        className={classes.settingsAndChatGrid}
      >
        <Grid item>
          <IconButton
            disableRipple
            className={
              chatIsOpen
                ? ` ${classes.activeBottomControlButton} ${classes.iconButton}`
                : classes.iconButton
            }
          >
            <Badge badgeContent={chatIsOpen ? 0 : numberOfUnreadChatMessages} color="secondary">
              <ChatBubbleIcon
                style={{ color: 'ghostWhite', fontSize: '2rem' }}
                onClick={toggleChat}
              />
            </Badge>
          </IconButton>
        </Grid>
        <SetupMicAndCameraButton setUserHasEnabledCameraAndMic={setUserHasEnabledCameraAndMic} />
      </Grid>
    </Grid>
  )
}

export default BottomControlPanel
