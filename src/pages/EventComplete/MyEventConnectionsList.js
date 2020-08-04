import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import { useHistory } from 'react-router-dom'
import FeatherIcon from 'feather-icons-react'

const useStyles = makeStyles((theme) => ({
  inlineEmailText: {
    display: 'inline',
  },
  messageIcon: {
    '&:hover': {
      stroke: theme.palette.common.sunray,
    },
  },
}))

const MyEventConnectionsList = ({ mutualThumbsData, userId }) => {
  const classes = useStyles()
  const history = useHistory()

  // returns [ { id: ___, email: ___ }, {....} ]
  const partnerDetails = mutualThumbsData.rounds.map((round) => {
    const idsAndEmails = Object.values(round)
    return idsAndEmails.filter((person) => person.id !== userId)
  })

  const populateList = () => {
    return partnerDetails.map((partner) => {
      return (
        <>
          <ListItem key={partner[0].id}>
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={partner[0].name} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="comments"
                onClick={() => history.push('/my-connections')}
              >
                <FeatherIcon
                  className={classes.messageIcon}
                  icon="message-square"
                  stroke="#f4f6fa"
                  size="20"
                />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider variant="inset" component="li" />
        </>
      )
    })
  }

  return <List>{populateList()}</List>
}

export default MyEventConnectionsList
