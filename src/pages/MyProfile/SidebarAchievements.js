import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const createStyles = makeStyles((theme) => ({
  achievementsContainer: {
    width: '100%',
    margin: theme.spacing(4, 0, 2, 0),
  },
  numbersContainer: {
    marginTop: theme.spacing(3),
  },
}))

const SidebarAchievements = () => {
  const classes = createStyles()
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
          <Typography variant="h3">173</Typography>
          <Typography variant="subtitle1">Connections</Typography>
        </Grid>
        <Grid container item direction="column" alignItems="center" justify="center" xs={12} md={6}>
          <Typography variant="h3">3</Typography>
          <Typography variant="subtitle1">Events Attended</Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default SidebarAchievements
