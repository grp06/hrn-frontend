import React from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '15%',
    padding: theme.spacing(1),
    borderRadius: '4px',
    border: '2px solid #3e4042',
    boxShadow: '5px 5px 0 #3e4042',
    backgroundColor: theme.palette.common.greyCard,
  },
  toggleGroup: {
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
  statusBox: {
    width: '100%',
    height: 'auto',
    color: theme.palette.common.sunray,
  },
  statusText: {
    textAlign: 'center',
  },
}))

const UserStatusBox = ({ eventStatus }) => {
  const classes = useStyles()
  const [userReadyJoin, setuserReadyJoin] = React.useState(true)
  const handleStatus = (event) => {
    console.log(event.button)
    event.currentTarget.value === 'sitOut' ? setuserReadyJoin(false) : setuserReadyJoin(true)
  }

  const renderStatusBoxContent = () => {
    switch (eventStatus) {
      case 'not-started':
        return (
          <Typography variant="h5" className={classes.statusText}>
            Sit tight, the event will start soon!
          </Typography>
        )
      case 'pre-event':
        return (
          <Typography variant="h5" className={classes.statusText}>
            Welcome remarks from the host
          </Typography>
        )
      default:
        return (
          <Grid container justify="space-between" alignItems="center" wrap="nowrap">
            <ToggleButtonGroup
              className={classes.toggleGroup}
              value={userReadyJoin}
              exclusive
              onChange={handleStatus}
            >
              <ToggleButton
                value="sitOut"
                className={!userReadyJoin ? classes.toggleSelect : classes.toggleUnSelect}
              >
                sit out a round
              </ToggleButton>
              <ToggleButton
                value="joinNext"
                className={userReadyJoin ? classes.toggleSelect : classes.toggleUnSelect}
              >
                Join next round
              </ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="body1" align="center" className={classes.statusBox}>
              {userReadyJoin ? 'Ready to Join Next Round.' : "You're sitting out rounds."}
            </Typography>
          </Grid>
        )
    }
  }

  return (
    <Grid container justify="center" alignItems="center" className={classes.container}>
      {renderStatusBoxContent()}
    </Grid>
  )
}

export default UserStatusBox
