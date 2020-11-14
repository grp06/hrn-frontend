import React from 'react'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    position: 'relative',
    backgroundColor: '#ffe7ec',
    // backgroundColor: '#fdeacd',
    // border: '1px solid #FF99AD',
    // boxShadow: '4px 4px 0 #FF99AD',
    // backgroundColor: '#d9c8f3',
    border: '2px solid #8C57DB',
    boxShadow: '4px 4px 0 #8C57DB',
    borderRadius: '4px',
    padding: theme.spacing(3, 5),
  },
}))

const PricingHero = () => {
  const classes = useStyles()
  return (
    <Grid container direction="column" className={classes.cardContainer}>
      <Typography variant="h2" style={{ color: 'black' }}>
        Host your own events{' '}
      </Typography>
      <Typography variant="body1" style={{ color: 'black' }}>
        Create events for your community or tap into the Hi Right Now community
      </Typography>
      <Typography variant="body1" style={{ color: 'black' }}>
        Try our Basic Plan for free!y
      </Typography>
      <Button variant="contained" size="large" color="primary">
        Join Basic
      </Button>
    </Grid>
  )
}

export default PricingHero
