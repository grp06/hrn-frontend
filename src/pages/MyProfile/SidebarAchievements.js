import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { useMyProfileStyles } from '.'

const SidebarAchievements = () => {
  const classes = useMyProfileStyles()
  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
      className={classes.achievementsContainer}
    >
      <Typography variant="subtitle2">ACHIEVEMENTS</Typography>
      <Grid container className={classes.numbersContainer}>
        <Grid container item direction="column" alignItems="center" justify="center" xs={12} md={6}>
          <Typography variant="h1">173</Typography>
          <Typography variant="subtitle1">Connections</Typography>
        </Grid>
        <Grid container item direction="column" alignItems="center" justify="center" xs={12} md={6}>
          <Typography variant="h1">3</Typography>
          <Typography variant="subtitle1">Events Attended</Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default SidebarAchievements
