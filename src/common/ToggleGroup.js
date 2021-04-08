import React from 'react'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  toggleButtonActive: {
    width: '175px',
    '&.Mui-selected': {
      color: theme.palette.common.ghostWhite,
      borderRadius: 4,
      border: 'none',
      backgroundColor: theme.palette.common.basePurple,
      '&:hover': {
        backgroundColor: 'rgb(98, 60, 153)',
      },
    },
    [theme.breakpoints.down('sm')]: {
      width: '100px',
    },
  },
  toggleButtonInactive: {
    width: '175px',
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
}))

const ToggleGroup = ({ toggleValueA, toggleValueB, toggleValue, setToggleValue }) => {
  const classes = useStyles()
  return (
    <ToggleButtonGroup
      value={toggleValue}
      exclusive
      onChange={(e) => setToggleValue(e.currentTarget.value)}
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
