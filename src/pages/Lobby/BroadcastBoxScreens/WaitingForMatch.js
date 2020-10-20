import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: 'auto',
    padding: theme.spacing(3, 5),
    width: '100%',
  },
  messageGrid: {
    marginTop: theme.spacing(3),
  },
}))

const WaitingForMatch = () => {
  const classes = useStyles()

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
      className={classes.cardContainer}
    >
      <Typography variant="h3">
        Glad to have you back{' '}
        <span role="img" aria-label="hugging hands">
          🤗
        </span>
      </Typography>
      <Grid className={classes.messageGrid}>
        <Typography variant="body1">
          We&apos;ve penciled you in and we&apos;ll pair you with someone as soon as we can.
        </Typography>
      </Grid>
    </Grid>
  )
}

export default WaitingForMatch
