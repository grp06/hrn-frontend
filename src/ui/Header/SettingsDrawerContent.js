import React from 'react'
import { useHistory } from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import FeatherIcon from 'feather-icons-react'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  drawerTitle: {
    textAlign: 'center',
    color: '#818588',
  },
  listItemText: {
    fontFamily: 'Muli',
    color: theme.palette.common.ghostWhiteBody,
    fontSize: '1rem',
    '&:hover': { color: theme.palette.common.sunray },
  },
}))

const SettingsDrawerContent = ({ resetUser }) => {
  const classes = useStyles()
  const history = useHistory()

  const handleLogout = () => {
    window.analytics && window.analytics.track('logged out')
    localStorage.clear()
    resetUser()
    history.push('/')
  }

  return (
    <div>
      <List disablePadding>
        <ListItem button disableRipple onClick={() => handleLogout()}>
          <ListItemIcon>
            <FeatherIcon icon="x-circle" stroke="#f4f6fa" size="24" />
          </ListItemIcon>
          <ListItemText disableTypography primary="Logout" className={classes.listItemText} />
        </ListItem>
      </List>
    </div>
  )
}

export default SettingsDrawerContent
