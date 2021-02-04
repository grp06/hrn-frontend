import React, { useEffect, useState } from 'react'
import copy from 'copy-to-clipboard'
import FeatherIcon from 'feather-icons-react'
import { useParams, useHistory } from 'react-router-dom'
import { Button, Grid, Typography, Container } from '@material-ui/core'
import blurryBackground from '../../assets/blurryBackground.png'
import {
  ChitChatCard,
  ChitChatCountdown,
  FanRSVPCard,
  SignUpAndRSVPForChitChatButton,
  RSVPForChitChatButton,
  RSVPForChitChatForm,
  StartChitChatButton,
  VisualQueue,
  WhatToExpectChitChat,
} from '.'
import { Loading, Snack } from '../../common'
import { useAppContext, useChitChatContext, useUserContext } from '../../context'
import { CameraAndMicSetupScreen } from '../Lobby'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    marginBottom: '125px',
    position: 'relative',
    backgroundColor: theme.palette.common.greyCard,
  },
  bodyContainer: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.common.bodyBlack,
  },
  copyEventLinkButton: {
    color: theme.palette.common.ghostWhite,
    margin: theme.spacing(3, 'auto'),
    textTransform: 'none',
    width: '100%',
    border: '2px solid #8C57DB',
  },
  CTAButton: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: 85,
    padding: theme.spacing(3, 1.5),
    [theme.breakpoints.down('xs')]: {
      left: 0,
    },
  },
  titleContainer: {
    backgroundImage: `url(${blurryBackground})`,
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
  },
}))

const ChitChat = () => {
  const classes = useStyles()
  const history = useHistory()
  const { appLoading } = useAppContext()
  const { id } = useParams()
  const chitChatId = parseInt(id, 10)

  const {
    user: { id: userId },
  } = useUserContext()

  const {
    chitChat,
    setChitChatId,
    userHasEnabledCameraAndMic,
    chitChatRSVPs,
    onlineChitChatUsersArray,
  } = useChitChatContext()

  const [showCopyURLSnack, setShowCopyURLSnack] = useState(false)
  const { host, host_id, start_at, status: eventStatus } = chitChat
  const { name: hostName, profile_pic_url: hostProfilePicUrl } = host || {}
  const userIsHost = parseInt(host_id, 10) === parseInt(userId, 10)
  const fanIsRSVPed =
    chitChatRSVPs && chitChatRSVPs.some((eventUser) => eventUser.user_id === userId)

  const currentUsersIndexInQueue =
    chitChatRSVPs && chitChatRSVPs.findIndex((eventUser) => eventUser.user_id === userId)

  const indexOfFanNextInQueue =
    chitChatRSVPs && chitChatRSVPs.findIndex((eventUser) => eventUser.status === 'in-queue')

  useEffect(() => {
    if (!Object.keys(chitChat).length && chitChatId) {
      setChitChatId(parseInt(chitChatId, 10))
    }
  }, [chitChatId, chitChat, setChitChatId])

  useEffect(() => {
    if (userIsHost && eventStatus === 'call-in-progress') {
      history.push(`/chit-chat/${chitChatId}/convo`)
    }
  }, [eventStatus, userIsHost])

  useEffect(() => {
    if (eventStatus === 'completed') {
      history.push(`/chit-chat/${chitChatId}/call-completed`)
    }
  }, [eventStatus])

  if (appLoading || Object.keys(chitChat).length < 2 || !chitChatRSVPs) {
    return <Loading />
  }

  if (!userHasEnabledCameraAndMic && (fanIsRSVPed || userIsHost)) {
    return <CameraAndMicSetupScreen chitChatEvent />
  }

  const handleShareEventClick = () => {
    copy(window.location.href)
    setShowCopyURLSnack(true)
  }

  const renderCTAButton = () => {
    if (userIsHost) {
      return (
        <StartChitChatButton
          onlineChitChatUsersArray={onlineChitChatUsersArray}
          chitChatId={chitChatId}
          userId={userId}
          disabled={!onlineChitChatUsersArray.length}
          chitChat={chitChat}
          chitChatRSVPs={chitChatRSVPs}
        />
      )
    }

    if (!fanIsRSVPed && !userIsHost) {
      return !userId ? (
        <SignUpAndRSVPForChitChatButton
          hostName={hostName}
          modalBody={<RSVPForChitChatForm chitChat={chitChat} />}
        />
      ) : (
        <RSVPForChitChatButton chitChatId={chitChatId} hostName={hostName} userId={userId} />
      )
    }
  }

  const renderCopyLinkButton = () => (
    <Button
      variant="outlined"
      color="primary"
      size="large"
      disableRipple
      className={classes.copyEventLinkButton}
      onClick={handleShareEventClick}
    >
      <Grid item container direction="row" alignItems="center" justify="center">
        <FeatherIcon icon="share-2" stroke="#f4f6fa" size="18" />
        <Typography variant="body1" style={{ marginLeft: '8px' }}>
          Copy event link
        </Typography>
      </Grid>
    </Button>
  )

  return (
    <Grid container direction="column" className={classes.pageContainer}>
      <Container className={classes.titleContainer} maxWidth="sm">
        <ChitChatCard
          chitChat={chitChat}
          userIsHost={userIsHost}
          chitChatRSVPs={chitChatRSVPs}
          onlineChitChatUsersArray={onlineChitChatUsersArray}
        />
      </Container>
      <Grid container direction="column" className={classes.bodyContainer}>
        <Container maxWidth="sm">
          {renderCopyLinkButton()}
          {eventStatus === 'not-started' ? (
            <FanRSVPCard
              fanIsRSVPed={fanIsRSVPed}
              eventStatus={eventStatus}
              fansQueueNumber={currentUsersIndexInQueue - indexOfFanNextInQueue}
              hostName={hostName}
            />
          ) : null}
          {eventStatus !== 'not-started' && fanIsRSVPed ? (
            <VisualQueue
              chitChatRSVPs={chitChatRSVPs}
              hostName={hostName}
              onlineChitChatUsers={onlineChitChatUsersArray}
              userId={userId}
            />
          ) : null}
          <Typography variant="h4">What to expect</Typography>
          <WhatToExpectChitChat userIsHost={userIsHost} />
        </Container>
      </Grid>
      <Grid container direction="row" className={classes.CTAButton}>
        <Container maxWidth="sm">{renderCTAButton()}</Container>
        {fanIsRSVPed && eventStatus === 'not-started' ? (
          <ChitChatCountdown eventStartTime={start_at} />
        ) : null}
      </Grid>
      <Snack
        open={showCopyURLSnack}
        duration={1800}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setShowCopyURLSnack(false)}
        severity="info"
        snackMessage={
          <div>
            Event Link Copied{' '}
            <span role="img" aria-label="floppy disk">
              💾
            </span>
          </div>
        }
      />
    </Grid>
  )
}

export default ChitChat
