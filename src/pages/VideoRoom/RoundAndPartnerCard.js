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
  },
  partnerName: {
    textAlign: 'center',
  },
}))

const RoundAndPartnerCard = ({ myRound, userId }) => {
  const classes = createStyles()

  let userIsPartnerX = false

  if (parseInt(userId, 10) === parseInt(myRound.partnerX_id, 10)) {
    userIsPartnerX = true
  }

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
      {getPartnerName()}
      {getPartnerCity()}
    </Grid>
  )
}

export default RoundAndPartnerCard
