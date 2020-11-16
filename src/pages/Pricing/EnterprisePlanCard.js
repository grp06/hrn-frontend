import React from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    borderRadius: '4px',
    backgroundColor: theme.palette.common.greyCard,
    width: '100%',
    margin: theme.spacing(2, 'auto'),
    padding: theme.spacing(3, 2),
    [theme.breakpoints.down('md')]: {
      width: '90%',
      margin: theme.spacing(2, 'auto'),
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: theme.spacing(2, 'auto'),
      padding: theme.spacing(2, 1.5),
    },
  },
  contactUsButton: {
    maxWidth: '200px',
    [theme.breakpoints.down('md')]: {
      minWidth: '50px',
      maxWidth: '150px',
      fontSize: '1rem',
      padding: theme.spacing(0.5, 1),
    },
  },
  planNameTypography: {
    fontWeight: 700,
    marginBottom: theme.spacing(0.25),
  },
  priceTypography: {
    fontWeight: 400,
    margin: theme.spacing(2, 0, 4, 0),
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(0, 0, 1, 0),
      fontSize: '1.25rem',
    },
  },
}))

const EnterprisePlanCard = ({ onSelect }) => {
  const classes = useStyles()
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className={classes.cardContainer}
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
