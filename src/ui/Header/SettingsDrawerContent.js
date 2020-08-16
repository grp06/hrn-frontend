import React from 'react'
import { useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import FeatherIcon from 'feather-icons-react'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  drawerTitle: {
    textAlign: 'center',
    color: '#818588',
  },
  listItem: {
    padding: theme.spacing(1.75, 0),
    '&:hover': {
      backgroundColor: theme.palette.common.dankPurp,
    },
  },
  listItemText: {
    fontFamily: 'Muli',
    color: theme.palette.common.ghostWhiteBody,
    fontSize: '1rem',
  },
}))

const SettingsDrawerContent = ({ resetUser, userId }) => {
  const classes = useStyles()
  const history = useHistory()

  const handleLogout = () => {
    window.analytics && window.analytics.track('logged out')
    localStorage.clear()
    resetUser()
    history.push('/')
  }

  const renderLoginOrLogout = () => {
    return userId ? (
      <ListItem button disableRipple onClick={() => handleLogout()} className={classes.listItem}>
        <Grid container direction="column" justify="center" alignItems="center">
          <ListItemIcon>
            <FeatherIcon icon="x-circle" stroke="#D1D9EA" size="26" />
          </ListItemIcon>
          <ListItemText disableTypography primary="Logout" className={classes.listItemText} />
        </Grid>
      </ListItem>
    ) : (
      <ListItem button disableRipple onClick={() => history.push('/')} className={classes.listItem}>
        <Grid container direction="column" justify="center" alignItems="center">
          <ListItemIcon>
            <FeatherIcon icon="log-in" stroke="#D1D9EA" size="26" />
          </ListItemIcon>
          <ListItemText disableTypography primary="Login" className={classes.listItemText} />
        </Grid>
      </ListItem>
    )
  }

  return (
    <div>
      <List disablePadding>{renderLoginOrLogout()}</List>
    </div>
  )
}

export default SettingsDrawerContent
