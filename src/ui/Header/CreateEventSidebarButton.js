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
    padding: theme.spacing(1, 0),
    backgroundColor: theme.palette.common.basePurple,
    borderRadius: '4px',
    width: '90%',
    margin: theme.spacing(2, 'auto'),
    height: '45px',
    '&:hover': {
      backgroundColor: 'rgb(98, 60, 153)',
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

const CreateEventSidebarButton = () => {
  const history = useHistory()
  const classes = useStyles()
  return (
    <List disablePadding>
      <ListItem
        button
        disableRipple
        onClick={() => history.push('/create-event')}
        className={classes.listItem}
      >
        <Grid container direction="row" justify="center" alignItems="center">
          <ListItemIcon style={{ paddingLeft: '8px' }}>
            <FeatherIcon icon="plus-circle" stroke="#f4f6fa" size="24" />
          </ListItemIcon>
          <ListItemText primary="Host an event" className={classes.listItemText} />
        </Grid>
      </ListItem>
    </List>
  )
}

export default CreateEventSidebarButton
