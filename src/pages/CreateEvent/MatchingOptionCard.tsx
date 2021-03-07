import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { useCreateEventStyles } from '.'
import clsx from 'clsx'

interface MatchingOptionCardProps {
  description: string
  imageURL: string
  isSelected: boolean
  optionName: string
}

const MatchingOptionCard: React.FC<MatchingOptionCardProps> = ({
  description,
  imageURL,
  isSelected,
  optionName,
}) => {
  const classes = useCreateEventStyles()
  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      spacing={2}
      className={clsx({
        [classes.selectedMatchingOption]: isSelected,
        [classes.matchingOptionCardContainer]: true,
      })}
    >
      <Grid item xs={3} style={{ height: '100%' }}>
        <img alt={`${optionName}-matching`} className={classes.matchingIcon} src={imageURL} />
      </Grid>
      <Grid container item xs={9} direction="column">
        <Typography variant="h4">{optionName}</Typography>
        <Typography variant="body1">{description}</Typography>
      </Grid>
    </Grid>
  )
}

export default MatchingOptionCard
