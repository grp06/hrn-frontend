import React from 'react'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  activePlan: {
    // boxShadow: '0px 0px 4px 4px #8C57DB',
    border: '2px solid #8C57DB',
    boxShadow: '4px 4px 0 #8C57DB',
  },
  cardTopSection: {
    padding: theme.spacing(0, 3),
    [theme.breakpoints.down('md')]: {
      flexDirection: 'row',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 1),
    },
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
  getStartedButton: {
    maxWidth: '200px',
    [theme.breakpoints.down('md')]: {
      minWidth: '50px',
      maxWidth: '150px',
      fontSize: '1rem',
      padding: theme.spacing(0.5, 1),
    },
  },
  planHighlightsList: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(0, 3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 1),
    },
  },
  planHighlightsSection: {
    padding: theme.spacing(0, 3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 1),
    },
  },
  planHighlightTypography: {
    marginBottom: theme.spacing(0.5),
  },
  planNameTypography: {
    fontWeight: 700,
    marginBottom: theme.spacing(0.25),
  },
  priceAndButtonContainer: {
    [theme.breakpoints.down('md')]: {
      alignItems: 'flex-end',
    },
  },
  pricingCardContainer: {
    borderRadius: '4px',
    backgroundColor: theme.palette.common.greyCard,
    width: '32%',
    margin: theme.spacing(2, 0),
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
  priceTypography: {
    fontWeight: 400,
    margin: theme.spacing(2, 0, 4, 0),
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(0, 0, 1, 0),
      fontSize: '1.25rem',
    },
  },
}))

const PricingPlanCard = ({ plan, onSelect }) => {
  const classes = useStyles()
  const {
    name,
    subtitle,
    price,
    prevPlanHighlights,
    highlights,
    maxAttendees,
    isActivePlan,
    disableButton,
  } = plan
  const renderHighlights = () => {
    return highlights.map((highlight) => {
      return (
        <Typography variant="body1" className={classes.planHighlightTypography} key={highlight}>
          {highlight}
        </Typography>
      )
    })
  }
  const renderPrevPlanHighlights = () => {
    return prevPlanHighlights.map((highlight) => {
      return (
        <Typography variant="body1" className={classes.planHighlightTypography} key={highlight}>
          {highlight}
        </Typography>
      )
    })
  }
  const renderMaxAttendees = () => {
    return (
      <Typography variant="body1" className={classes.planHighlightTypography}>
        Up to {maxAttendees} Attendees
      </Typography>
    )
  }

  return (
    <Grid
      container
      direction="column"
      className={`${classes.pricingCardContainer} ${isActivePlan && classes.activePlan}`}
    >
      <Grid container direction="column" className={classes.cardTopSection}>
        <Grid container item xs={7} lg={12} direction="column">
          <Typography variant="h2" className={classes.planNameTypography}>
            {name}
          </Typography>
          <Typography variant="subtitle1">{subtitle}</Typography>
        </Grid>
        <Grid
          container
          item
          xs={5}
          lg={12}
          direction="column"
          className={classes.priceAndButtonContainer}
        >
          <Typography variant="h3" className={classes.priceTypography}>
            {price}
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="primary"
            disableRipple
            className={classes.getStartedButton}
            onClick={onSelect}
            disabled={isActivePlan || disableButton}
          >
            {isActivePlan ? 'Current Plan' : 'Get Started'}
          </Button>
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Grid container direction="column" className={classes.planHighlightsSection}>
        <Typography variant="h4">Plan Highlights</Typography>
        <Grid className={classes.planHighlightsList}>
          {renderMaxAttendees()}
          {renderPrevPlanHighlights()}
          {renderHighlights()}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default PricingPlanCard
