import React, { useEffect } from 'react'
import FeatherIcon from 'feather-icons-react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import { useParams, useHistory } from 'react-router-dom'
import {
  ChitChatCard,
  MeetCelebButton,
  RSVPForChitChatForm,
  StartChitChatButton,
  WhatToExpectChitChat,
} from '.'
import { Loading } from '../../common'
import { useAppContext, useChitChatContext, useUserContext } from '../../context'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  copyEventLinkButton: {
    color: theme.palette.common.ghostWhite,
    margin: theme.spacing(3, 'auto'),
    textTransform: 'none',
    width: '100%',
  },
  CTAButton: {
    marginTop: theme.spacing(4),
  },
  bodyContainer: {
    padding: theme.spacing(2),
  },
  queueCard: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(1),
    background: theme.palette.common.greyCard,
    textAlign: 'center',
  },
  queueNumber: {
    color: theme.palette.common.basePink,
    fontSize: 20,
    fontWeight: 'bold',
  },
  fanMainContent: {
    margin: theme.spacing(2, 0),
  },
}))

const ChitChat = () => {
  const classes = useStyles()
  const { appLoading } = useAppContext()
  const { id: chitChatId } = useParams()
  const {
    user: { id: userId },
  } = useUserContext()
  const { chitChat, setEventNewId } = useChitChatContext()
  const { event_users_new, host, host_id, start_at, status: event_status } = chitChat
  const { name: hostName, profile_pic_url: hostProfilePicUrl } = host || {}
  const userIsHost = parseInt(host_id, 10) === parseInt(userId, 10)
  const currentUserIsRSVPd =
    event_users_new && event_users_new.some((eventUser) => eventUser.user.id === userId)
  const usersQueueNumber =
    event_users_new &&
    event_users_new.findIndex((u) => {
      return u.user.id === userId
    })
  const history = useHistory()

  useEffect(() => {
    if (!Object.keys(chitChat).length && chitChatId) {
      setEventNewId(parseInt(chitChatId, 10))
    }
  }, [chitChatId, chitChat, setEventNewId])

  useEffect(() => {
    if (userIsHost && event_status === 'call-in-progress') {
      history.push(`/chit-chat/${chitChatId}/video-room`)
    }
  }, [event_status, userIsHost])

  useEffect(() => {
    if (!userIsHost && event_status === 'call-in-progress' && event_users_new.length && userId) {
      const currentFanStatus = event_users_new.find((eventUser) => eventUser.user.id === userId)
        .status

      if (currentFanStatus === 'in-chat') {
        console.log('push me to chat')
        history.push(`/chit-chat/${chitChatId}/video-room`)
      }
    }
  }, [event_status, event_users_new, userId])

  if (appLoading || Object.keys(chitChat).length < 2) {
    return <Loading />
  }

  const renderCTAButton = () => {
    return !currentUserIsRSVPd ? (
      <Grid container direction="row" className={classes.CTAButton}>
        {userIsHost ? (
          <StartChitChatButton chitChatId={chitChatId} userId={userId} />
        ) : (
          <MeetCelebButton
            hostName={hostName}
            modalBody={<RSVPForChitChatForm chitChat={chitChat} />}
          />
        )}
      </Grid>
    ) : null
  }

  const renderCopyLinkButton = () =>
    userIsHost && (
      <Button
        variant="outlined"
        color="primary"
        size="large"
        className={classes.copyEventLinkButton}
      >
        <Grid item container direction="row" alignItems="center" justify="center">
          <FeatherIcon icon="share-2" stroke="#f4f6fa" size="18" />
          <Typography variant="body1" style={{ marginLeft: '8px' }}>
            Copy event link
          </Typography>
        </Grid>
      </Button>
    )

  const renderQueueText = () => {
    if (usersQueueNumber === 0) {
      return `You're up next! You'll speak with ${hostName} soon!`
    }
    return (
      <>
        <span className={classes.queueNumber}>{usersQueueNumber}</span>{' '}
        {usersQueueNumber > 1 ? 'people' : 'person'} in front of you
      </>
    )
  }

  const renderFanMainContent = () =>
    !userIsHost && usersQueueNumber >= 0 ? (
      <Grid direction="column" container className={classes.fanMainContent}>
        <Typography variant="h3">You are now in the queue</Typography>
        <div className={classes.queueCard}>
          <Typography variant="h4">{renderQueueText()}</Typography>
        </div>
        <Typography variant="subtitle1">
          You can leave this page, but if you’re not here when it’s your turn, you will be skipped.
        </Typography>
      </Grid>
    ) : null

  return (
    <Grid container direction="column">
      <ChitChatCard chitChat={chitChat} userIsHost={userIsHost} />
      <Grid container direction="column" className={classes.bodyContainer}>
        {renderCopyLinkButton()}
        {renderFanMainContent()}
        <Typography variant="h4">What to expect</Typography>
        <WhatToExpectChitChat userIsHost={userIsHost} />
        {renderCTAButton()}
      </Grid>
    </Grid>
  )
}

export default ChitChat
