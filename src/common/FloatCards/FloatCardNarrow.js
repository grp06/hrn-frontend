import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'

const createStyles = makeStyles((theme) => ({
  cardContainer: {
    position: 'relative',
    top: '-40px',
    bottom: '0%',
    display: 'block',
    width: '35vw',
    height: 'auto',
    padding: theme.spacing(3),
    borderRadius: '4px',
    border: '2px solid #3e4042',
    boxShadow: '5px 5px 0 #3e4042',
    backgroundColor: theme.palette.common.greyCard,
    [theme.breakpoints.down('md')]: {
      width: '50vw',
    },
    [theme.breakpoints.down('xs')]: {
      width: '85vw',
    },
  },
}))

const FloatCardMedium = ({ children }) => {
  const classes = createStyles()
  return (
    <Grid container direction="column" className={classes.cardContainer}>
      {children}
    </Grid>
  )
}

export default FloatCardMedium
