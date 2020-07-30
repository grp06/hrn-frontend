import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  inlineEmailText: {
    display: 'inline',
  },
}))

const MyEventConnectionsList = ({ mutualThumbsData, userId }) => {
  const classes = useStyles()

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
            <ListItemText
              primary={partner[0].name}
              secondary={
                <Typography variant="body1" className={classes.inlineEmailText}>
                  {partner[0].email}
                </Typography>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </>
      )
    })
  }

  return <List>{populateList()}</List>
}

export default MyEventConnectionsList
