import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const PartnerPreview = ({ myRound, userId }) => {
  const useStyles = makeStyles((theme) => ({
    partnerPreview: {
      background: theme.palette.common.blackBody,
      width: '100%',
      height: 'calc(100vh - 64px)',
      position: 'fixed',
      top: 64,
      left: 0,
    },
  }))
  const classes = useStyles()

  return (
    <Grid container direction="column" alignItems="center" className={classes.partnerPreview}>
      <Typography variant="h1">Heyo</Typography>
    </Grid>
  )
}

export default PartnerPreview
