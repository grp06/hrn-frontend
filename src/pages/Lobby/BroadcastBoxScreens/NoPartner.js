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

const NoPartner = () => {
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
        You are the chosen one{' '}
        <span role="img" aria-label="crown">
          👑
        </span>
      </Typography>
      <Grid className={classes.messageGrid}>
        <Typography variant="body1">
          Sometimes we have an odd number of people and need someone to sit out.
        </Typography>
        <Typography variant="body1">
          But no worries, we&apos;ll pair you with someone as soon as we can.
        </Typography>
        <Typography variant="body1">
          Get a drink of water. Stretch. Do a little dance{' '}
          <span role="img" aria-label="dancing man">
            🕺
          </span>
          .
        </Typography>
      </Grid>
    </Grid>
  )
}

export default NoPartner
