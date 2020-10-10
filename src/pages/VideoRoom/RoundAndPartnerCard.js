import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const createStyles = makeStyles((theme) => ({
  addFriendButtonContainer: {
    width: '60%',
    margin: theme.spacing(0, 'auto'),
  },
  cardContainer: {
    position: 'relative',
    bottom: '0%',
    display: 'block',
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
    border: '2px solid #3e4042',
    boxShadow: '5px 5px 0 #3e4042',
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
        <Typography variant="h5" className={classes.partnerName}>
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
      <div className={classes.addFriendButtonContainer}>{addFriendButton}</div>
    </Grid>
  )
}

export default RoundAndPartnerCard
