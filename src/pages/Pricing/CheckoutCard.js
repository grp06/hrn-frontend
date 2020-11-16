import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { motion } from 'framer-motion'

import { CheckoutForm } from '.'

const useStyles = makeStyles((theme) => ({
  checkoutCardContainer: {
    width: '70vw',
    margin: theme.spacing(0, 'auto'),
    backgroundColor: theme.palette.common.basePurple,
    borderRadius: '4px',
  },
  planNameContainer: {
    width: '100%',
    height: '25%',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.common.greyCard,
  },
}))

const CheckoutCard = () => {
  const classes = useStyles()
  return (
    <motion.div
      initial={{ x: 2000 }}
      animate={{ x: 0, transition: { duration: 0.55 } }}
      className={classes.checkoutCardContainer}
    >
      <Grid container direction="row" alignItems="center">
        <Grid container direction="column" justify="center" alignItems="flex-start" item lg={5}>
          <Grid className={classes.planNameContainer}>
            <Typography variant="h1">Pro</Typography>
            <Typography variant="h1">Monthly</Typography>
            <Typography variant="h3" style={{ marginTop: '8px' }}>
              $49.99
            </Typography>
          </Grid>
        </Grid>
        <Grid container item lg={7}>
          <CheckoutForm />
        </Grid>
      </Grid>
    </motion.div>
  )
}

export default CheckoutCard
