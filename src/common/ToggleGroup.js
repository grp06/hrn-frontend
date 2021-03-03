import React from 'react'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  toggleButtonActive: {
    width: '100px',
    '&.Mui-selected': {
      color: 'rgba(0, 0, 0, 0.87)',
      // borderRadius: 0,
      borderRadius: 4,
      border: 'none',

      // borderBottom: `2px solid ${theme.palette.common.basePink}`,
      // backgroundColor: 'transparent',
      backgroundColor: theme.palette.common.basePink,
      '&:hover': {
        backgroundColor: 'rgb(178, 107, 121)',
      },
    },
    [theme.breakpoints.down('sm')]: {
      width: '100px',
    },
  },
  toggleButtonInactive: {
    width: '100px',
    color: theme.palette.common.ghostWhite,
    backgroundColor: theme.palette.common.greyButton,
    borderRadius: 4,
    border: 'none',
    '&:hover': {
      backgroundColor: theme.palette.common.greyButtonHover,
    },
    [theme.breakpoints.down('sm')]: {
      width: '100px',
    },
  },
  toggleButtonGroup: {
    margin: theme.spacing(0, 0, 6, 0),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0, 0, 3, 0),
    },
  },
}))

const ToggleGroup = ({ toggleValueA, toggleValueB, toggleValue, setToggleValue }) => {
  const classes = useStyles()
  return (
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
  )
}

export default ToggleGroup
