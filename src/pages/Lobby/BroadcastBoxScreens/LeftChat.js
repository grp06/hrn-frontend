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
}))

const LeftChat = () => {
  const classes = useStyles()
  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
      className={classes.cardContainer}
    >
      <Typography variant="h2">
        Sorry you had to leave the chat{' '}
        <span role="img" aria-label="really crying">
          😭
        </span>
      </Typography>
      <Typography variant="h3">
        We&apos;ve put your name back into the hat and we&apos;ll pair you with someone as soon as
        we can.
      </Typography>
    </Grid>
  )
}

export default LeftChat
