import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Redirect, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import { useQuery } from '@apollo/react-hooks'
import { useAppContext, useUserContext } from '../../context'
import { Loading, ChitChatCard } from '../../common'
import { getChitChatUsersByUserId } from '../../gql/queries'
import blurryBackground from '../../assets/blurryBackground.png'

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    marginTop: theme.spacing(10),
    position: 'relative',
    minHeight: '100%',
  },
  logo: {
    width: '62px',
    height: '62px',
  },
  creatorSignUpTitle: {
    margin: theme.spacing(2, 0, 12, 0),
  },
  clickBelowSubtitle: {
    marginTop: theme.spacing(1),
  },
  createEventButton: {
    position: 'absolute',
    bottom: theme.spacing(2),
    margin: '0 auto',
  },
  pageBanner: {
    width: '100%',
    height: '30vh',
    backgroundImage: `url(${blurryBackground})`,
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    marginBottom: '40px',
  },
}))

const FanHome = () => {
  const classes = useStyles()
  const { user } = useUserContext()
  const { appLoading } = useAppContext()
  const { id: userId } = user

  const { data: chitChatUsersData, loading: chitChatsLoading } = useQuery(
    getChitChatUsersByUserId,
    {
      variables: {
        userId: userId,
      },
      skip: !userId,
    }
  )
  useEffect(() => {
    window.analytics.page('/fan-home')
  }, [])

  if (appLoading || chitChatsLoading) {
    return <Loading />
  }

  if (!userId) {
    console.log('redirect to fan login')
    return <Redirect to="/fan-login" />
  }

  const renderChitChats = () => {
    return (
      <>
        <Grid
          container
          direction="column"
          justify="flex-end"
          alignItems="center"
          className={classes.pageBanner}
        >
          <Grid item container direction="column" className={classes.pageBannerContentContainer}>
            <Typography variant="h1">My Events</Typography>
          </Grid>
        </Grid>
        {!chitChatUsersData.chit_chat_users.length ? (
          <Typography variant="h3">No upcoming events </Typography>
        ) : (
          chitChatUsersData.chit_chat_users.map((chitChat) => (
            <ChitChatCard key={chitChat.id} chitChat={chitChat.event} />
          ))
        )}
      </>
    )
  }

  return (
    <>
      <Grid container className={classes.pageContainer} alignItems="center" direction="column">
        {renderChitChats()}
      </Grid>
    </>
  )
}

export default FanHome
