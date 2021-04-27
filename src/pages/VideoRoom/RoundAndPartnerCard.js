import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { useVideoRoomStyles } from '.'

const RoundAndPartnerCard = ({ event, myRound }) => {
  const classes = useVideoRoomStyles()
  const { num_rounds, current_round } = event

  const getCurrentRoundNumber = () => (
    <Typography className={classes.roundNumberText} variant="subtitle2">
      Round {current_round} of {num_rounds}
    </Typography>
  )

  const getPartnerCity = () =>
    myRound.partner &&
    myRound.partner.city && (
      <Typography variant="subtitle1" className={classes.partnerName}>
        {myRound.partner.city}
      </Typography>
    )

  const getPartnerName = () =>
    myRound.partner &&
    myRound.partner.first_name && (
      <Typography variant="h3" className={classes.partnerName}>
        {myRound.partner.first_name}
      </Typography>
    )

  return (
    <Grid
      container
      direction="column"
      className={classes.roundAndPartnerCardContainer}
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
