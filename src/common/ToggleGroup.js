import React from 'react'
import Grid from '@material-ui/core/Grid'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  toggleButtonActive: {
    width: '125px',
    '&.Mui-selected': {
      color: theme.palette.common.basePink,
      borderRadius: 0,
      border: 'none',
      borderBottom: `2px solid ${theme.palette.common.basePink}`,
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    [theme.breakpoints.down('sm')]: {
      width: '100px',
    },
  },
  toggleButtonInactive: {
    width: '125px',
    color: theme.palette.common.ghostWhite,
    borderRadius: 0,
    border: 'none',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100px',
    },
  },
  toggleButtonGroup: {
    margin: theme.spacing(0, 0, 6, 0),
  },
}))

const ToggleGroup = ({ toggleValueA, toggleValueB, toggleValue, setToggleValue }) => {
  const classes = useStyles()
  return (
    <Grid container justify="flex-start" alignItems="center">
      <ToggleButtonGroup
        value={toggleValue}
        exclusive
        onChange={(e) => setToggleValue(e.currentTarget.value)}
        className={classes.toggleButtonGroup}
      >
        <ToggleButton
          value={toggleValueA}
          disableRipple
          className={
            toggleValue === toggleValueA ? classes.toggleButtonActive : classes.toggleButtonInactive
          }
        >
          {toggleValueA}
        </ToggleButton>
        <ToggleButton
          value={toggleValueB}
          disableRipple
          className={
            toggleValue === toggleValueB ? classes.toggleButtonActive : classes.toggleButtonInactive
          }
        >
          {toggleValueB}
        </ToggleButton>
      </ToggleButtonGroup>
    </Grid>
  )
}

export default ToggleGroup
