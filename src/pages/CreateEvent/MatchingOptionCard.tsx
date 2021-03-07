import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { useCreateEventStyles } from '.'
import clsx from 'clsx'

interface MatchingOptionCardProps {
  description: string
  imageURL: string
  isSelected: boolean
  onClick: (value: string) => void
  optionName: string
  value: string
}

const MatchingOptionCard: React.FC<MatchingOptionCardProps> = ({
  description,
  imageURL,
  isSelected,
  onClick,
  optionName,
  value,
}) => {
  const classes = useCreateEventStyles()
  return (
    <div onClick={() => onClick(value)} style={{ height: '100%' }}>
      <Grid container justify="center" alignItems="center" spacing={2} style={{ height: '100%' }}>
        <Grid item xs={3} style={{ height: '100%' }}>
          <img alt={`${optionName}-matching`} className={classes.matchingIcon} src={imageURL} />
        </Grid>
        <Grid container item xs={9} direction="column">
          <Typography variant="h4">{optionName}</Typography>
          <Typography variant="body1">{description}</Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default MatchingOptionCard
