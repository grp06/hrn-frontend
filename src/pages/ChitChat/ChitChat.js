import React, { useEffect } from 'react'
import FeatherIcon from 'feather-icons-react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useSubscription, useMutation } from 'react-apollo'
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
import { makeStyles } from '@material-ui/styles'
import { listenToOnlineFansByChitChatId } from '../../gql/subscriptions'
import { updateFanStatus } from '../../gql/mutations'

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
}))

const ChitChat = () => {
  const classes = useStyles()
  const { appLoading } = useAppContext()
  const { id: chitChatId } = useParams()
  const {
    user: { id: userId },
  } = useUserContext()
  const [updateFanStatusMutation] = useMutation(updateFanStatus)

  const { chitChat, setEventNewId } = useChitChatContext()
  const { event_users_new, host, host_id, start_at, status: event_status } = chitChat
  const { name: hostName, profile_pic_url: hostProfilePicUrl } = host || {}
  const userIsHost = parseInt(host_id, 10) === parseInt(userId, 10)
  const fanIsRSVPed =
    event_users_new && event_users_new.some((eventUser) => eventUser.user.id === userId)

  const fansQueueNumber =
    event_users_new &&
    event_users_new.findIndex((u) => {
      return u.user.id === userId
    })

  const history = useHistory()
  const { data: onlineFansData, loading: fansLoading } = useSubscription(
    listenToOnlineFansByChitChatId,
    {
      variables: {
        chitChatId,
      },
      skip: !chitChatId,
    }
  )
  useEffect(() => {
    if (!Object.keys(chitChat).length && chitChatId) {
      setEventNewId(parseInt(chitChatId, 10))
    }
  }, [chitChatId, chitChat, setEventNewId])

  useEffect(() => {
    if (userIsHost && event_status === 'call-in-progress') {
      const firstFanToMeet = onlineFansData.online_event_users_new[0].user_id

      updateFanStatusMutation({
        variables: {
          userId: firstFanToMeet,
          status: 'in-chat',
        },
      })
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
    if (userIsHost && event_users_new.length) {
      return <StartChitChatButton chitChatId={chitChatId} userId={userId} />
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
    <Grid container direction="column">
      <ChitChatCard chitChat={chitChat} userIsHost={userIsHost} />
      <Grid container direction="column" className={classes.bodyContainer}>
        {renderCopyLinkButton()}
        <FanQueueCard
          eventStatus={event_status}
          fanIsRSVPed={fanIsRSVPed}
          fansQueueNumber={fansQueueNumber}
          hostName={hostName}
        />
        <Typography variant="h4">What to expect</Typography>
        <WhatToExpectChitChat userIsHost={userIsHost} />
        <Grid container direction="row" className={classes.CTAButton}>
          {renderCTAButton()}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ChitChat
