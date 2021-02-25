import React from 'react'
import { motion } from 'framer-motion'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  hostEmojiiContainer: {
    height: '100%',
    backgroundColor: theme.palette.common.greyCard,
    padding: theme.spacing(1),
  },
  hostNameCard: {
    position: 'absolute',
    top: 'auto',
    bottom: '90px',
    right: 'auto',
    left: '0',
    borderRadius: '4px',
    width: 'auto',
    minWidth: '300px',
    height: '80px',
  },
  hostNameContainer: {
    height: '100%',
    backgroundColor: theme.palette.common.basePurple,
    padding: theme.spacing(1),
  },
}))

const AnimatedHostNameCard = ({ hostsFirstName }) => {
  const classes = useStyles()
  return (
    <motion.div
      initial={{ x: -500, y: 40 }}
      animate={{ x: 0, y: 40 }}
      transition={{ delay: 3, ease: 'easeOut', duration: 2 }}
    >
      <Grid container alignItems="center" className={classes.hostNameCard}>
        <Grid
          container
          item
          justify="center"
          alignItems="center"
          xs={3}
          className={classes.hostEmojiiContainer}
        >
          <Typography variant="h2">
            <span role="img" aria-label="champage bottle" style={{ fontSize: '3rem' }}>
              🍾
            </span>
          </Typography>
        </Grid>
        <Grid
          container
          item
          xs={9}
          justify="center"
          alignItems="center"
          className={classes.hostNameContainer}
        >
          <Typography variant="h2">{hostsFirstName}</Typography>
        </Grid>
      </Grid>
    </motion.div>
  )
}

export default AnimatedHostNameCard
