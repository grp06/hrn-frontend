import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import { listenToChatMessages } from '../gql/subscriptions'
import { insertPersonalChatMessage } from '../gql/mutations'

import { useSubscription, useMutation } from '@apollo/react-hooks'

const createStyles = makeStyles((theme) => ({
  chatContainer: {
    position: 'absolute',
    bottom: '10%',
    right: '1%',
    display: 'block',
    width: '25vw',
    height: '50vh',
    borderRadius: '4px',
    backgroundColor: theme.palette.common.greyCard,
    [theme.breakpoints.down('md')]: {
      width: '60vw',
    },
    [theme.breakpoints.down('xs')]: {
      width: '85vw',
    },
  },
  chatList: {
    flexDirection: 'column',
    height: '83%',
  },
  sendMessage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  from: {
    color: 'grey',
  },
}))

const ChatBox = ({ userId, eventId, partnerId }) => {
  const classes = createStyles()

  const [message, setMessage] = useState(null)
  const [list, setList] = useState(null)

  const { data: eventData } = useSubscription(listenToChatMessages, {
    variables: {
      user_id: userId,
      partner_id: partnerId,
    },
    skip: !eventId,
  })

  const [insertPersonalChatMessageMutation] = useMutation(insertPersonalChatMessage, {
    user_id: userId,
    partner_id: partnerId,
    content: message,
  })

  useEffect(() => {
    if (eventData && !list) {
      console.log('eventData = ', eventData)
      setList(eventData)
    }
  }, [eventData])

  return (
    <Grid container direction="column" className={classes.chatContainer}>
      <List dense className={classes.chatList}>
        {eventData &&
          eventData.personal_chat_messages.length &&
          eventData.personal_chat_messages.map((message) => {
            console.log('message = ', message)
            return (
              <ListItem>
                <span className={classes.from}>{message.user.name}:&nbsp;</span>
                <ListItemText>{message.content} </ListItemText>
              </ListItem>
            )
          })}
      </List>
      <Grid item container direction="column" className={classes.inputContainer}>
        <Grid item>
          <TextField
            id="message"
            required
            fullWidth
            className={classes.input}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            onClick={() => {
              insertPersonalChatMessageMutation({
                variables: {
                  user_id: userId,
                  partner_id: partnerId,
                  content: message,
                },
              })
            }}
            className={classes.sendMessage}
          >
            Send
          </Button>
        </Grid>
      </Grid>
      {/* <List dense>
        {oldOnlineUsers.map(({ user }) => {
          // const formattedDate = user.updated_at.slice(0, 10)
          // const lastSeen = moment(formattedDate, 'YYYY-MM-DD').fromNow()
          return (
            <ListItem key={user.id}>
              <ListItemAvatar>
                <Avatar>
                  <img
                    alt="company-logo"
                    className={classes.avatar}
                    src={user.profile_pic_url || logo}
                  />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name} />
            </ListItem>
          )
        })}
      </List>       */}
    </Grid>
  )
}

export default ChatBox
