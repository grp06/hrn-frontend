import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  partnerNameGrid: {
    width: '100vw',
    marginBottom: theme.spacing(2),
  },
  partnerNameContainer: {
    padding: '5px 20px',
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    border: '2px solid #3e4042',
    boxShadow: '5px 5px 0 #3e4042',
  },
  partnerName: {
    textAlign: 'center',
  },
}))

const ShowPartnerName = ({ userId, myRound }) => {
  const classes = useStyles()

  let userIsPartnerX = false

  if (parseInt(userId, 10) === parseInt(myRound.partnerX_id, 10)) {
    userIsPartnerX = true
  }
  return (
    <Grid container justify="center" alignItems="center" className={classes.partnerNameGrid}>
      <div className={classes.partnerNameContainer}>
        <Typography variant="h5" className={classes.partnerName}>
          {userIsPartnerX ? myRound.partnerY.name : myRound.partnerX.name}
        </Typography>
      </div>
    </Grid>
  )
}

export default ShowPartnerName
