import React from 'react'
import { motion } from 'framer-motion'
import { Grid, Typography } from '@material-ui/core'
import { useLobbyStyles } from '.'

const UserEventStatusCard = ({ userEventStatus }) => {
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

  const renderMessage = () => {
    switch (userEventStatus) {
      case 'came late':
        return (
          <>
            <Typography variant="h3">
              Awh shucks, we just missed throwing your name into the hat for this round{' '}
              <span role="img" aria-label="blue cap">
                🧢
              </span>
            </Typography>
            <Grid className={classes.sittingOutAndStatusMessageGrid}>
              <Typography variant="body1">
                But don&apos;t worry! We&apos;ve penciled you in and we&apos;ll pair you with
                someone as soon as we can.
              </Typography>
            </Grid>
          </>
        )

      case 'left chat':
        return (
          <>
            <Typography variant="h3">
              Sorry you had to leave the chat{' '}
              <span role="img" aria-label="really crying">
                😭
              </span>
            </Typography>
            <Grid className={classes.sittingOutAndStatusMessageGrid}>
              <Typography variant="body1">
                We&apos;ve put your name back into the hat and we&apos;ll pair you with someone as
                soon as we can.
              </Typography>
            </Grid>
          </>
        )

      case 'no partner':
        return (
          <>
            <Typography variant="h3">
              You are the chosen one{' '}
              <span role="img" aria-label="crown">
                👑
              </span>
            </Typography>
            <Grid className={classes.sittingOutAndStatusMessageGrid}>
              <Typography variant="body1">
                Sometimes we have an odd number of people and need someone to sit out.
              </Typography>
              <Typography variant="body1">
                But no worries, we&apos;ll pair you with someone as soon as we can.
              </Typography>
              <Typography variant="body1">
                Get a drink of water. Stretch. Do a little dance{' '}
                <span role="img" aria-label="dancing man">
                  🕺
                </span>
                .
              </Typography>
            </Grid>
          </>
        )

      case 'waiting for match':
        return (
          <>
            <Typography variant="h3">
              Glad to have you back{' '}
              <span role="img" aria-label="hugging hands">
                🤗
              </span>
            </Typography>
            <Grid className={classes.sittingOutAndStatusMessageGrid}>
              <Typography variant="body1">
                We&apos;ve penciled you in and we&apos;ll pair you with someone as soon as we can.
              </Typography>
            </Grid>
          </>
        )

      default:
        return null
    }
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
        {renderMessage()}
      </Grid>
    </motion.div>
  )
}

export default UserEventStatusCard
