import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { Redirect, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import { useQuery } from '@apollo/react-hooks'
import { useAppContext, useUserContext } from '../../context'
import logo from '../../assets/logoWhite.svg'
import { Loading, ChitChatCard } from '../../common'
import { getChitChatsByUserId } from '../../gql/queries'
import blurryBackground from '../../assets/blurryBackground.png'

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    // This is the the height of the drawer
    marginTop: 56,
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
  title: {
    // paddingLeft: 50,
    paddingBottom: 20,
    width: '85vw',
    margin: '0 auto',
  },
}))

const CreatorHome = () => {
  const classes = useStyles()
  const { user } = useUserContext()
  const history = useHistory()
  const { appLoading } = useAppContext()
  const { id: userId } = user

  const { data: chitChatsData, loading: chitChatsLoading } = useQuery(getChitChatsByUserId, {
    variables: {
      userId: userId,
    },
    skip: !userId,
  })
  console.log('🚀 ~ CreatorHome ~ chitChatsData', chitChatsData)
  useEffect(() => {
    window.analytics.page('/creator-home')
  }, [])

  const renderHello = () => {
    return user && user.name ? `Hi, ${user.name.split(' ')[0]} 👋` : ''
  }

  if (appLoading || chitChatsLoading) {
    return <Loading />
  }

  if (!userId) {
    return <Redirect to="/login-new" />
  }

  const renderCreateChitChat = () => {
    return (
      <>
        <img alt="company-logo" className={classes.logo} src={user.profile_pic_url || logo} />
        <Typography variant="h4" className={classes.creatorSignUpTitle}>
          {renderHello()}
        </Typography>
        <Typography variant="h3">Thanks for signing up!</Typography>
        <Typography variant="subtitle1" className={classes.clickBelowSubtitle}>
          Click below to create your first event.
        </Typography>
        <Button
          color="primary"
          type="submit"
          variant="contained"
          className={classes.createEventButton}
          onClick={() => history.push('/create-chit-chat')}
        >
          Create Event
        </Button>
      </>
    )
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
            <Typography className={classes.title} variant="h1">
              My Events
            </Typography>
          </Grid>
        </Grid>
        {chitChatsData.chit_chats.map((chitChat) => (
          <ChitChatCard key={chitChat.id} chitChat={chitChat} />
        ))}
      </>
    )
  }

  return (
    <>
      <Grid container className={classes.pageContainer} alignItems="center" direction="column">
        {!chitChatsData?.chit_chats.length ? renderCreateChitChat() : renderChitChats()}
        <Button
          color="primary"
          type="submit"
          variant="contained"
          className={classes.createEventButton}
          onClick={() => history.push('/create-chit-chat')}
        >
          Create Event
        </Button>
      </Grid>
    </>
  )
}

export default CreatorHome
