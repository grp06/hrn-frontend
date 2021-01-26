import React, { useEffect } from 'react'
import FeatherIcon from 'feather-icons-react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useParams, useHistory } from 'react-router-dom'
import {
  ChitChatCard,
  FanQueueCard,
  MeetCelebButton,
  RSVPForChitChatForm,
  StartChitChatButton,
  WhatToExpectChitChat,
} from '.'
import { Loading } from '../../common'
import { useAppContext, useChitChatContext, useUserContext } from '../../context'
import { CameraAndMicSetupScreen } from '../Lobby'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  copyEventLinkButton: {
    color: theme.palette.common.ghostWhite,
    margin: theme.spacing(3, 'auto'),
    textTransform: 'none',
    width: '100%',
  },
  CTAButton: {
    width: '100vw',
    position: 'fixed',
    top: 'auto',
    bottom: 0,
    padding: theme.spacing(3, 1.5),
    backgroundColor: theme.palette.common.greyCard,
  },
  bodyContainer: {
    padding: theme.spacing(2),
  },
}))

const ChitChat = () => {
  const classes = useStyles()
  const { appLoading } = useAppContext()
  const { id: chitChatId } = useParams()
  const {
    user: { id: userId },
  } = useUserContext()

  const {
    chitChat,
    setEventNewId,
    userHasEnabledCameraAndMic,
    chitChatRSVPs,
    onlineChitChatUsersArray,
  } = useChitChatContext()

  const { host, host_id, start_at, status: eventStatus } = chitChat
  const { name: hostName, profile_pic_url: hostProfilePicUrl } = host || {}
  const userIsHost = parseInt(host_id, 10) === parseInt(userId, 10)
  // const startTime = new Date(start_at).getTime()
  // const diff = startTime - Date.now()
  const history = useHistory()

  useEffect(() => {
    if (!Object.keys(chitChat).length && chitChatId) {
      setEventNewId(parseInt(chitChatId, 10))
    }
  }, [chitChatId, chitChat, setEventNewId])

  useEffect(() => {
    if (userIsHost && eventStatus === 'call-in-progress') {
      history.push(`/chit-chat/${chitChatId}/video-room`)
    }
  }, [eventStatus, userIsHost])

  useEffect(() => {
    if (
      !userIsHost &&
      eventStatus === 'call-in-progress' &&
      onlineChitChatUsersArray.length &&
      userId
    ) {
      const currentFan = onlineChitChatUsersArray.find((eventUser) => eventUser.user_id === userId)
      if (currentFan && currentFan.status === 'in-chat') {
        history.push(`/chit-chat/${chitChatId}/video-room`)
      }
    }
  }, [eventStatus, onlineChitChatUsersArray, userId])

  if (appLoading || Object.keys(chitChat).length < 2 || !chitChatRSVPs) {
    return <Loading />
  }

  const fanIsRSVPed = chitChatRSVPs.some((eventUser) => eventUser.user_id === userId)

  if (!userHasEnabledCameraAndMic && (fanIsRSVPed || userIsHost)) {
    return <CameraAndMicSetupScreen chitChatEvent />
  }

  const currentUsersIndexInQueue = chitChatRSVPs.findIndex(
    (eventUser) => eventUser.user_id === userId
  )

  const indexOfFanNextInQueue = chitChatRSVPs.findIndex(
    (eventUser) => eventUser.status === 'in-queue'
  )

  const renderCTAButton = () => {
    if (userIsHost) {
      return (
        <StartChitChatButton
          onlineChitChatUsersArray={onlineChitChatUsersArray}
          chitChatId={chitChatId}
          userId={userId}
          disabled={!onlineChitChatUsersArray.length}
        />
      )
    }

    if (!fanIsRSVPed && !userIsHost) {
      return (
        <MeetCelebButton
          hostName={hostName}
          modalBody={<RSVPForChitChatForm chitChat={chitChat} />}
        />
      )
    }
  }

  const renderCopyLinkButton = () => (
    <Button variant="outlined" color="primary" size="large" className={classes.copyEventLinkButton}>
      <Grid item container direction="row" alignItems="center" justify="center">
        <FeatherIcon icon="share-2" stroke="#f4f6fa" size="18" />
        <Typography variant="body1" style={{ marginLeft: '8px' }}>
          Copy event link
        </Typography>
      </Grid>
    </Button>
  )

  return (
    <Grid container direction="column" style={{ position: 'relative' }}>
      <ChitChatCard
        chitChat={chitChat}
        userIsHost={userIsHost}
        chitChatRSVPs={chitChatRSVPs}
        onlineChitChatUsersArray={onlineChitChatUsersArray}
      />
      <Grid container direction="column" className={classes.bodyContainer}>
        {renderCopyLinkButton()}
        <FanQueueCard
          fanIsRSVPed={fanIsRSVPed}
          eventStatus={eventStatus}
          fansQueueNumber={currentUsersIndexInQueue - indexOfFanNextInQueue}
          hostName={hostName}
        />
        <Typography variant="h4">What to expect</Typography>
        <WhatToExpectChitChat userIsHost={userIsHost} />
      </Grid>
      <Grid container direction="row" className={classes.CTAButton}>
        {renderCTAButton()}
      </Grid>
    </Grid>
  )
}

export default ChitChat
