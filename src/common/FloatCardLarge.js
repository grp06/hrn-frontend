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
    height: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: '75px',
    borderRadius: '4px',
    borderColor: theme.palette.common.greyBorder,
    boxShadow: theme.palette.common.greyBoxShadow,
    backgroundColor: theme.palette.common.greyCard,
  },
}))

const FloatCardLarge = ({ children }) => {
  const classes = createStyles()
  return (
    <Grid container direction="column" className={classes.cardContainer}>
      {children}
    </Grid>
  )
}

export default FloatCardLarge
