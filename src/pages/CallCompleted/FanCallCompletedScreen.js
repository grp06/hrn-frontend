import React from 'react'
import { Button, Grid, Typography } from '@material-ui/core'
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

const FanCallCompletedScreen = ({
  hostsCashAppLink,
  hostsFirstName,
  hostsVenmoLink,
  suggestedDonation,
}) => {
  const classes = useStyles()
  return (
    <>
      <Typography variant="h3" className={classes.header}>
        Help {hostsFirstName} out!{' '}
        <span role="img" aria-label="hug arms">
          🤗
        </span>
      </Typography>
      <Typography variant="body1" className={classes.bodyText}>
        We hope you enjoyed your chat!
      </Typography>
      <Typography variant="body1" className={classes.bodyText}>
        {hostsFirstName} doesn&apos;t want to say bye just yet! They suggest a{' '}
        <span style={{ fontWeight: 600 }}>donation of ${suggestedDonation}</span> so they can
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
    </>
  )
}

export default FanCallCompletedScreen
