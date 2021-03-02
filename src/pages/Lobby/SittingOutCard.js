import React from 'react'
import { motion } from 'framer-motion'
import { Button, Grid, Typography } from '@material-ui/core'
import { useLobbyStyles } from '.'

const SittingOutCard = ({ setUserEventStatus }) => {
  const classes = useLobbyStyles()

  const eventStatusVariants = {
    glow: {
      scale: 1.01,
      boxShadow: '0px 0px 4px 4px #8C57DB',
      transition: {
        duration: 2.0,
        yoyo: Infinity,
      },
    },
  }

  const handleRejoinEventClick = () => {
    setUserEventStatus('waiting for match')
  }

  return (
    <motion.div variants={eventStatusVariants} animate="glow">
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        className={classes.sittingOutAndStatusCardContainer}
      >
        <Typography variant="h3">
          You are sitting out of the event{' '}
          <span role="img" aria-label="sad face">
            😢
          </span>
        </Typography>
        <Grid className={classes.sittingOutAndStatusMessageGrid}>
          <Typography variant="body1">
            Your name won&apos;t be thrown in the hat for the matching algorithm. Whenever
            you&apos;re ready to join again, just hit the button below.
          </Typography>
          <Typography variant="body1">
            We can&apos;t wait until you&apos;re back in the event!
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={handleRejoinEventClick}
            style={{ marginTop: '16px' }}
          >
            Rejoin Event
          </Button>
        </Grid>
      </Grid>
    </motion.div>
  )
}

export default SittingOutCard
