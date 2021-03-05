import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { useHostOnboardingStyles } from '.'

const HostOnboardingStep = ({ question, options, onChange, value }) => {
  const classes = useHostOnboardingStyles()
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
