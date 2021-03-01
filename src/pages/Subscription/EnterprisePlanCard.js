import React from 'react'
import { Grid, Button, Typography } from '@material-ui/core'
import { useSubscriptionStyles } from '.'

const EnterprisePlanCard = ({ onSelect }) => {
  const classes = useSubscriptionStyles()
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className={classes.enterprisePlanCardContainer}
    >
      <Grid container direction="column" justify="center" alignItems="center">
        <Typography variant="h2" className={classes.planNameTypography}>
          Enterprise
        </Typography>
        <Typography variant="subtitle1">Best for companies</Typography>
        <Typography variant="h3" className={classes.priceTypography}>
          Custom
        </Typography>
        <Button
          variant="contained"
          size="large"
          color="primary"
          disableRipple
          className={classes.contactUsButton}
          onClick={onSelect}
        >
          Contact Us
        </Button>
      </Grid>
    </Grid>
  )
}

export default EnterprisePlanCard
