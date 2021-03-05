import React from 'react'
import FeatherIcon from 'feather-icons-react'
import { useHistory } from 'react-router-dom'
import PersonIcon from '@material-ui/icons/Person'
import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core'
import { useEventCompleteStyles } from '.'

const MyEventConnectionsList = ({ mutualThumbsData, userId }) => {
  const classes = useEventCompleteStyles()
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
              {partner[0].profile_pic_url ? (
                <Avatar src={partner[0].profile_pic_url} className={classes.avatarBackground} />
              ) : (
                <PersonIcon />
              )}
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
