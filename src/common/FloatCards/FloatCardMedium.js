import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'

const createStyles = makeStyles((theme) => ({
  cardContainer: {
    position: 'relative',
    bottom: '0%',
    display: 'block',
    width: '50vw',
    height: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
    borderRadius: '4px',
    backgroundColor: theme.palette.common.greyCard,
    [theme.breakpoints.down('xs')]: {
      width: '85vw',
    },
  },
}))

const FloatCardMedium = ({ children }, noMarginBottom) => {
  const classes = createStyles()
  return (
    <Grid
      container
      direction="column"
      className={classes.cardContainer}
      style={{ marginBottom: noMarginBottom ? 0 : 75 }}
    >
      {children}
    </Grid>
  )
}

export default FloatCardMedium
