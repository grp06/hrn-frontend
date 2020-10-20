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
  listItem: {
    padding: theme.spacing(1.5, 0, 1.5, 2.25),
    '&:hover': {
      backgroundColor: theme.palette.common.basePurple,
    },
  },
  listItemText: {
    fontFamily: 'Muli',
    color: 'ghostWhite',
    fontSize: '1rem',
    fontWeight: '300',
    marginLeft: theme.spacing(1),
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
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <ListItemIcon>
            <FeatherIcon icon="log-out" stroke="#FFFFFF" size="24" />
          </ListItemIcon>
          <ListItemText disableTypography primary="Logout" className={classes.listItemText} />
        </Grid>
      </ListItem>
    ) : (
      <ListItem button disableRipple onClick={() => history.push('/')} className={classes.listItem}>
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <ListItemIcon>
            <FeatherIcon icon="log-in" stroke="#FFFFFF" size="24" />
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
