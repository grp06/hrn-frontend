import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  optionCard: {
    backgroundColor: theme.palette.common.grey10,
    padding: theme.spacing(1),
    cursor: 'pointer',
    color: theme.palette.common.ghostWhite,
    margin: theme.spacing(2),
    width: '45%',
    borderRadius: '4px',
    [theme.breakpoints.down('md')]: {
      width: '70%',
    },
    '&:hover': {
      backgroundColor: theme.palette.common.basePurple,
    },
  },
  optionsContainer: {
    margin: theme.spacing(4, 0),
  },
  selectedOptionCard: {
    backgroundColor: theme.palette.common.basePurple,
  },
}))

const HostOnboardingStep = ({ question, options, onChange, value }) => {
  const classes = useStyles()
  const createOptionCards = () => {
    return options.map((option) => (
      <Grid
        item
        container
        key={option}
        alignItems="center"
        justify="center"
        className={`${classes.optionCard} ${value === option && classes.selectedOptionCard}`}
        onClick={() => onChange(option)}
      >
        <Typography variant="h4">{option}</Typography>
      </Grid>
    ))
  }

  return (
    <Grid container direction="column" alignItems="center">
      <Typography variant="h3" style={{ textAlign: 'center' }}>
        {question}
      </Typography>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.optionsContainer}
      >
        {createOptionCards()}
      </Grid>
    </Grid>
  )
}

export default HostOnboardingStep
