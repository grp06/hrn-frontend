import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    padding: theme.spacing(1),
    borderRadius: '4px',
    border: '2px solid #3e4042',
    boxShadow: '5px 5px 0 #3e4042',
    backgroundColor: theme.palette.common.greyCard,
  },
  toggleButtonsContainer: {
    width: '100%',
    height: 'auto',
  },
  toggleSelect: {
    color: theme.palette.common.ghostWhiteSub,
    backgroundColor: theme.palette.common.dankPurp,
    '&:hover': {
      backgroundColor: theme.palette.common.dankPurp,
    },
  },
  toggleUnSelect: {
    color: theme.palette.common.ghostWhite,
    backgroundColor: theme.palette.common.greyCard,
    '&:hover': {
      backgroundColor: theme.palette.common.greyCard,
    },
  },
  statusText: {
    width: '100%',
    height: 'auto',
    textAlign: 'center',
    color: theme.palette.common.sunray,
    marginTop: theme.spacing(0.5),
  },
}))

const UserStatusBox = ({ eventStatus, userSittingOut, onToggleClick }) => {
  const classes = useStyles()
  const [userReadyJoin, setuserReadyJoin] = useState(!userSittingOut)
  const handleUserStatusChange = (event) => {
    console.log(event.button)
    event.currentTarget.value === 'sitOut' ? setuserReadyJoin(false) : setuserReadyJoin(true)
    event.currentTarget.value === 'sitOut' ? onToggleClick(true) : onToggleClick(false)
  }

  return (
    <Grid
      container
      direction="column"
      justify="space-around"
      alignItems="center"
      className={classes.container}
    >
      <Grid
        container
        justify="center"
        alignItems="center"
        wrap="nowrap"
        className={classes.toggleButtonsContainer}
      >
        <ToggleButtonGroup value={userReadyJoin} exclusive onChange={handleUserStatusChange}>
          <ToggleButton
            value="sitOut"
            className={!userReadyJoin ? classes.toggleSelect : classes.toggleUnSelect}
          >
            Sit out a round
          </ToggleButton>
          <ToggleButton
            value="joinNext"
            className={userReadyJoin ? classes.toggleSelect : classes.toggleUnSelect}
          >
            Join next round
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Typography variant="body1" align="center" className={classes.statusText}>
        {userReadyJoin ? 'Ready to Join Next Round.' : "You're sitting out rounds."}
      </Typography>
    </Grid>
  )
}

export default UserStatusBox
