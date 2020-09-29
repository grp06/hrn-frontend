import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
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
    width: '50%',
    lineHeight: '1',
    padding: theme.spacing(2, 1),
    color: theme.palette.common.ghostWhiteSub,
    backgroundColor: theme.palette.common.dankPurp,
    '&:hover': {
      backgroundColor: theme.palette.common.dankPurp,
    },
  },
  toggleUnSelect: {
    width: '50%',
    lineHeight: '1',
    padding: theme.spacing(2, 1),
    color: theme.palette.common.ghostWhite,
    backgroundColor: '#bdbdbd',
    '&:hover': {
      backgroundColor: '#d7d7d7',
    },
  },
}))

const UserStatusBox = React.memo(({ userEventStatus, eventStatus, setUserEventStatus }) => {
  const classes = useStyles()
  const [sittingOutToggle, setSittingOutToggle] = useState(userEventStatus === 'sitting out')
  const handleUserStatusChange = (event) => {
    const sittingOutBoolean = event.currentTarget.value === 'sitOut'
    const status = sittingOutBoolean ? 'sitting out' : 'waiting for match'
    setSittingOutToggle(sittingOutBoolean)
    setUserEventStatus(status)
  }

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
        <ToggleButtonGroup
          value={sittingOutToggle}
          exclusive
          onChange={handleUserStatusChange}
          style={{ width: '100%' }}
        >
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
            Match Me
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  ) : null
})

export default UserStatusBox
