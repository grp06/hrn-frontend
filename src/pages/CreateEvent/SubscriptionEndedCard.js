import React from 'react'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: 'auto',
    padding: theme.spacing(3, 5),
    margin: theme.spacing(0, 'auto'),
    width: '80%',
    maxWidth: '800px',
  },
  heading: { fontWeight: 700, marginBottom: theme.spacing(3) },
  subheading: {
    fontWeight: 300,
    width: '80%',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      width: '90%',
    },
  },
  reactivateButton: {
    maxWidth: '250px',
    marginTop: theme.spacing(2),
  },
}))

const SubscriptionEndedCard = ({ timeSinceSubEnded }) => {
  const classes = useStyles()
  const history = useHistory()
  return (
    <Grid container direction="column" className={classes.cardContainer}>
      <Typography variant="h2" className={classes.heading}>
        You&apos;re subscription ended {timeSinceSubEnded}{' '}
        <span role="img" aria-label="distraught cat">
          🙀
        </span>
      </Typography>
      <Typography variant="h4" className={classes.subheading}>
        We would love for you to keep throwing your awesome events.
      </Typography>
      <Typography variant="h4" className={classes.subheading}>
        Click the button below to come back to the party{' '}
        <span role="img" aria-label="confetti ball">
          🎊
        </span>
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        disableRipple
        className={classes.reactivateButton}
        onClick={() => history.push('/subscription')}
      >
        Reactivate my plan
      </Button>
    </Grid>
  )
}

export default SubscriptionEndedCard
