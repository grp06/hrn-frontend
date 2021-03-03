import React from 'react'
import { motion } from 'framer-motion'
import { Grid, Typography } from '@material-ui/core'
import { usePreEventStyles } from '.'

const AnimatedHostNameCard = ({ hostsFirstName }) => {
  const classes = usePreEventStyles()
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
