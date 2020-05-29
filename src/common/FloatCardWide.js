import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'

const createStyles = makeStyles((theme) => ({
  cardContainer: {
    position: 'relative',
    top: '-40px',
    bottom: '0%',
    display: 'block',
    width: '75vw',
    height: '70vh',
    marginRight: 'auto',
    marginLeft: 'auto',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 20px 0 rgba(56, 61, 59, 0.3)',
  },
}))

const FloatCardWide = ({ children }) => {
  const classes = createStyles()
  return (
    <Grid container direction="column" className={classes.cardContainer}>
      {children}
    </Grid>
  )
}

export default FloatCardWide
