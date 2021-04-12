import React from 'react'
import { Grid } from '@material-ui/core'
import { motion } from 'framer-motion'
import { useCheckoutStyles } from '.'

const CheckoutCard = ({ form }) => {
  const classes = useCheckoutStyles()

  return (
    <motion.div initial={{ x: 2000 }} animate={{ x: 0, transition: { duration: 0.55 } }}>
      <Grid container className={classes.checkoutCardContainer}>
        {form}
      </Grid>
    </motion.div>
  )
}

export default CheckoutCard
