import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const createStyles = makeStyles((theme) => ({
  cardContainer: {
    position: 'relative',
    bottom: '0%',
    display: 'block',
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
    backgroundColor: theme.palette.common.greyCard,
    padding: theme.spacing(1, 0),
  },
  partnerName: {
    textAlign: 'center',
    marginBottom: '0',
  },
  roundNumberText: {
    textAlign: 'center',
  },
}))

const RoundAndPartnerCard = ({ addFriendButton, event, myRound }) => {
  const classes = createStyles()
  const { num_rounds, current_round } = event

  const getCurrentRoundNumber = () => (
    <Typography className={classes.roundNumberText} variant="subtitle2">
      Round {current_round} of {num_rounds}
    </Typography>
  )

  const getPartnerCity = () => {
    return (
      myRound.partner &&
      myRound.partner.city && (
        <Typography variant="subtitle1" className={classes.partnerName}>
          {myRound.partner.city}
        </Typography>
      )
    )
  }

  const getPartnerName = () => {
    return (
      myRound.partner &&
      myRound.partner.name && (
        <Typography variant="h3" className={classes.partnerName}>
          {myRound.partner.name}
        </Typography>
      )
    )
  }

  return (
    <Grid
      container
      direction="column"
      className={classes.cardContainer}
      justify="center"
      alignItems="center"
    >
      {getCurrentRoundNumber()}
      {getPartnerName()}
      {getPartnerCity()}
      <Grid container justify="center" alignItems="center">
        {addFriendButton}
      </Grid>
    </Grid>
  )
}

export default RoundAndPartnerCard
