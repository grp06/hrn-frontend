import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'

const createStyles = makeStyles((theme) => ({
  cardContainer: {
    position: 'relative',
    top: '-40px',
    bottom: '0%',
    display: 'block',
    width: '50vw',
    height: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: '75px',
    borderRadius: '4px',
    border: '2px solid #3e4042',
    boxShadow: '5px 5px 0 #3e4042',
    backgroundColor: theme.palette.common.greyCard,
    [theme.breakpoints.down('xs')]: {
      width: '85vw',
    },
  },
}))

const FloatCardMedium = ({ children, extraClasses }) => {
  const classes = createStyles()
  return (
    <Grid container direction="column" className={[classes.cardContainer, extraClasses]}>
      {children}
    </Grid>
  )
}

export default FloatCardMedium
