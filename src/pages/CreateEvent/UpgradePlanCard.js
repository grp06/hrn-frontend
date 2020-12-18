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
  upgradeButton: {
    maxWidth: '200px',
    marginTop: theme.spacing(2),
  },
}))

const UpgradePlanCard = () => {
  const classes = useStyles()
  const history = useHistory()
  return (
    <Grid container direction="column" className={classes.cardContainer}>
      <Typography variant="h2" className={classes.heading}>
        You&apos;ve run out of free events{' '}
        <span role="img" aria-label="distraught face">
          😫
        </span>
      </Typography>
      <Typography variant="h4" className={classes.subheading}>
        With a free host account you only get one free event.
      </Typography>
      <Typography variant="h4" className={classes.subheading}>
        Click the button below to view our plan options and upgrade your account!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        disableRipple
        className={classes.upgradeButton}
        onClick={() => history.push('/subscription')}
      >
        Upgrade my plan
      </Button>
    </Grid>
  )
}

export default UpgradePlanCard
