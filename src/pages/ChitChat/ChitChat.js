import React, { useEffect } from 'react'
import FeatherIcon from 'feather-icons-react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
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
}))

const ChitChat = ({ match }) => {
  const classes = useStyles()
  const { id: chitChatId } = match.params
  const { appLoading } = useAppContext()
  const { user } = useUserContext()
  const { id: user_id } = user
  const { chitChat, setEventNewId } = useChitChatContext()
  const { event_users_new, host, host_id, start_at, status: event_status } = chitChat
  const { name: hostName, profile_pic_url: hostProfilePicUrl } = host || {}
  const userIsHost = parseInt(host_id, 10) === parseInt(user_id, 10)
  const chitChatSet = Object.keys(chitChat).length > 1

  useEffect(() => {
    if (!Object.keys(chitChat).length && chitChatId) {
      setEventNewId(parseInt(chitChatId, 10))
    }
  }, [chitChatId, chitChat, setEventNewId])

  if (appLoading || Object.keys(chitChat).length < 2) {
    return <Loading />
  }

  const renderCTAButton = () => {
    return (
      <Grid container direction="row" className={classes.CTAButton}>
        {userIsHost ? (
          <StartChitChatButton />
        ) : (
          <MeetCelebButton
            hostName={hostName}
            modalBody={<RSVPForChitChatForm chitChat={chitChat} chitChatId={chitChatId} />}
          />
        )}
      </Grid>
    )
  }

  return (
    <Grid container direction="column">
      <ChitChatCard chitChat={chitChat} userIsHost={userIsHost} />
      <Grid container direction="column" className={classes.bodyContainer}>
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
        <Typography variant="h4">What to expect</Typography>
        <WhatToExpectChitChat userIsHost={userIsHost} />
        {renderCTAButton()}
      </Grid>
    </Grid>
  )
}

export default ChitChat
