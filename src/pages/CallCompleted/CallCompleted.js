import React, { useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Button, Grid, Typography } from '@material-ui/core'
import { useAppContext, useChitChatContext, useUserContext } from '../../context'
import cashAppLogo from '../../assets/cashAppLogo.png'
import venmoLogo from '../../assets/venmoLogo.png'
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
  const { host, status: eventStatus, suggested_donation } = chitChat
  const { cash_app, hostsCashAppLink, name: hostName, venmo: hostsVenmoLink } = host || {}
  const chitChatId = parseInt(id, 10)
  const hostFirstName = hostName && hostName.split(' ')[0]
  const venmoLink = useEffect(() => {
    if (!Object.keys(chitChat).length && chitChatId) {
      setChitChatId(parseInt(chitChatId, 10))
    }
  }, [chitChatId, chitChat, setChitChatId])

  useEffect(() => {
    if (eventStatus === 'not-started') {
      history.push(`/chit-chat/${chitChatId}`)
    }
  }, [eventStatus])

  return (
    <Grid container direction="column" justify="center" className={classes.pageContainer}>
      <Typography variant="h3" className={classes.header}>
        Help {hostFirstName} out!{' '}
        <span role="img" aria-label="hug arms">
          🤗
        </span>
      </Typography>
      <Typography variant="body1" className={classes.bodyText}>
        We hope you enjoyed your chat!
      </Typography>
      <Typography variant="body1" className={classes.bodyText}>
        {hostFirstName} doesn&apos;t want to say bye just yet! They suggest a{' '}
        <span style={{ fontWeight: 600 }}>donation of ${suggested_donation}</span> so they can
        continue saying hi to their fans. But any amount you feel comfortable with will go a long
        way{' '}
        <span role="img" aria-label="hands raised">
          🙌
        </span>
        .
      </Typography>

      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.buttonContainer}
      >
        <Typography variant="h4">Donate via:</Typography>
        {hostsVenmoLink ? (
          <Button
            variant="contained"
            size="large"
            className={classes.venmoButton}
            href={`https://venmo.com/${hostsVenmoLink}`}
            target="_blank"
            rel="noopener noreferrer"
          />
        ) : null}
        {hostsCashAppLink ? (
          <Button
            variant="contained"
            size="large"
            className={classes.cashAppButton}
            href={`https://cash.app/$${hostsCashAppLink}`}
            target="_blank"
            rel="noopener noreferrer"
          />
        ) : null}
      </Grid>
    </Grid>
  )
}

export default CallComplete
