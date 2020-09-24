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
    backgroundColor: '#bdbdbd',
    '&:hover': {
      backgroundColor: '#d7d7d7',
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

const UserStatusBox = React.memo(({ userEventStatus, eventStatus, setUserEventStatus }) => {
  console.log('userEventStatus ->', userEventStatus)
  const classes = useStyles()
  const [sittingOutToggle, setSittingOutToggle] = useState(userEventStatus === 'sitting out')
  const handleUserStatusChange = (event) => {
    const sittingOutBoolean = event.currentTarget.value === 'sitOut'
    const status = sittingOutBoolean ? 'sitting out' : 'waiting for match'
    console.log('sittingOutBoolean ->', sittingOutBoolean)
    console.log('status ->', status)
    setSittingOutToggle(sittingOutBoolean)
    setUserEventStatus(status)
  }

  console.log('sittingOutToggle ->', sittingOutToggle)

  return eventStatus !== 'not-started' && eventStatus !== 'pre-event' ? (
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
        <ToggleButtonGroup value={sittingOutToggle} exclusive onChange={handleUserStatusChange}>
          <ToggleButton
            value="sitOut"
            className={sittingOutToggle ? classes.toggleSelect : classes.toggleUnSelect}
          >
            Sit Out
          </ToggleButton>
          <ToggleButton
            value="joinNext"
            className={!sittingOutToggle ? classes.toggleSelect : classes.toggleUnSelect}
          >
            Get Matched
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Typography variant="subtitle2" align="center" className={classes.statusText}>
        {sittingOutToggle ? "You're sitting out rounds" : 'Ready to join next round'}
      </Typography>
    </Grid>
  ) : null
})

export default UserStatusBox
