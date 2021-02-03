import React, { useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Button, Grid, Typography } from '@material-ui/core'
import { useAppContext, useChitChatContext, useUserContext } from '../../context'
import cashAppLogo from '../../assets/cashAppLogo.png'
import venmoLogo from '../../assets/venmoLogo.png'
import { CelebCallCompletedScreen, FanCallCompletedScreen } from '.'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  bodyText: {
    marginBottom: theme.spacing(0.75),
    [theme.breakpoints.up('sm')]: {
      width: '70%',
      fontSize: '1.25rem',
    },
  },
  buttonContainer: {
    marginTop: '75px',
    [theme.breakpoints.up('sm')]: {
      alignItems: 'flex-start',
      width: '40%',
    },
  },
  cashAppButton: {
    backgroundColor: theme.palette.common.greyButton,
    backgroundImage: `url(${cashAppLogo})`,
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '50%',
    height: '125px',
    margin: theme.spacing(1.5, 0),
    width: '75%',
    '&:hover': {
      backgroundColor: theme.palette.common.greyButton,
      border: '2px solid #61d152',
    },
  },
  header: {
    marginBottom: theme.spacing(1.5),
    [theme.breakpoints.up('sm')]: {
      fontSize: '2.125rem',
    },
  },
  pageContainer: {
    marginTop: '150px',
    padding: theme.spacing(0, 4),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 12),
    },
  },
  venmoButton: {
    backgroundColor: 'white',
    backgroundImage: `url(${venmoLogo})`,
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '50%',
    height: '125px',
    margin: theme.spacing(1.5, 0),
    width: '75%',
    '&:hover': {
      backgroundColor: 'white',
      border: '2px solid #5c96ca',
    },
  },
}))

const CallComplete = () => {
  const classes = useStyles()
  const history = useHistory()
  const { id } = useParams()
  const { chitChat, setChitChatId } = useChitChatContext()
  const {
    user: { role: usersRole },
  } = useUserContext()
  const { host, status: eventStatus, suggested_donation } = chitChat
  const { cash_app: hostsCashAppLink, name: hostName, venmo: hostsVenmoLink } = host || {}
  const chitChatId = parseInt(id, 10)
  const hostsFirstName = hostName && hostName.split(' ')[0]

  useEffect(() => {
    if (!Object.keys(chitChat).length && chitChatId) {
      setChitChatId(parseInt(chitChatId, 10))
    }
  }, [chitChatId, chitChat, setChitChatId])

  // useEffect(() => {
  //   if (eventStatus === 'not-started') {
  //     history.push(`/chit-chat/${chitChatId}`)
  //   }
  // }, [eventStatus])

  return (
    <Grid container direction="column" justify="center" className={classes.pageContainer}>
      {usersRole === 'fan' ? (
        <FanCallCompletedScreen
          hostsCashAppLink={hostsCashAppLink}
          hostsFirstName={hostsFirstName}
          hostsVenmoLink={hostsVenmoLink}
          suggestedDontation={suggested_donation}
        />
      ) : (
        <CelebCallCompletedScreen />
      )}
    </Grid>
  )
}

export default CallComplete
