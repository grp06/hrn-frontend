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
  },
  buttonContainer: {
    marginTop: '75px',
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
  },
  header: {
    marginBottom: theme.spacing(1.5),
  },
  pageContainer: {
    marginTop: '150px',
    padding: theme.spacing(0, 4),
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
  },
}))

const CallComplete = () => {
  const classes = useStyles()
  const history = useHistory()
  const { id } = useParams()
  const { chitChat, setEventNewId } = useChitChatContext()
  const { host, status: eventStatus } = chitChat
  const { name: hostName } = host || {}
  const chitChatId = parseInt(id, 10)
  const hostFirstName = hostName && hostName.split(' ')[0]

  useEffect(() => {
    if (!Object.keys(chitChat).length && chitChatId) {
      setEventNewId(parseInt(chitChatId, 10))
    }
  }, [chitChatId, chitChat, setEventNewId])

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
        <span style={{ fontWeight: 600 }}>donation of $10</span> so they can continue saying hi to
        their fans. But any amount you feel comfortable with will go a long way{' '}
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
        <Button variant="contained" size="large" className={classes.venmoButton} />
        <Button variant="contained" size="large" className={classes.cashAppButton} />
      </Grid>
    </Grid>
  )
}

export default CallComplete
