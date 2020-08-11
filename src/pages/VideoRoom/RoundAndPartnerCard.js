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
    marginBottom: theme.spacing(1.3),
  },
}))

const RoundAndPartnerCard = ({ event, myRound, userId }) => {
  const classes = createStyles()
  const { num_rounds, current_round } = event

  let userIsPartnerX = false

  if (parseInt(userId, 10) === parseInt(myRound.partnerX_id, 10)) {
    userIsPartnerX = true
  }

  const getCurrentRoundNumber = () => (
    <Typography className={classes.roundNumberText} variant="subtitle2">
      Round {current_round} of {num_rounds}
    </Typography>
  )

  const getPartnerCity = () => {
    if (!myRound.partnerY || !myRound.partnerX) {
      return null
    }

    const city =
      userIsPartnerX && myRound.partnerY.city ? myRound.partnerY.city : myRound.partnerX.city
    return (
      <Typography variant="subtitle1" className={classes.partnerName}>
        {city}
      </Typography>
    )
  }

  const getPartnerName = () => {
    const { partnerY, partnerX } = myRound
    return (
      myRound &&
      partnerY &&
      partnerX && (
        <Typography variant="h5" className={classes.partnerName}>
          {userIsPartnerX ? myRound.partnerY.name : myRound.partnerX.name}
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
    </Grid>
  )
}

export default RoundAndPartnerCard
