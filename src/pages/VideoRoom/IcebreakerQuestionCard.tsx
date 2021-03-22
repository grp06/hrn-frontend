import React from 'react'
import { Grid } from '@material-ui/core'
import { MysteryBox, useVideoRoomStyles } from '.'

export interface IcebreakerQuestionCardProps {}

const IcebreakerQuestionCard: React.FC<IcebreakerQuestionCardProps> = () => {
  const classes = useVideoRoomStyles()
  return (
    <Grid
      container
      direction="row"
      className={classes.icebreakerQuestionCard}
      alignItems="center"
      justify="center"
    >
      <MysteryBox />
    </Grid>
  )
}

export default IcebreakerQuestionCard
