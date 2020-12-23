import React, { useState, useEffect } from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import { insertEventChatMessage } from '../gql/mutations'
import { listenToEventChatMessages } from '../gql/subscriptions'
import { constants, formatChatMessagesDate } from '../utils'
const { bottomNavBarHeight } = constants

const createStyles = makeStyles((theme) => ({
  chatBoxTitle: {
    padding: theme.spacing(1.5, 0),
    fontFamily: 'Muli',
    fontWeight: 700,
    color: theme.palette.common.basePink,
  },
  chatContainer: {
    position: 'fixed',
    bottom: bottomNavBarHeight + 75,
    right: '1%',
    display: 'block',
    width: '25vw',
    height: '50vh',
    borderRadius: '4px',
    backgroundColor: theme.palette.common.greyCard,
    zIndex: '999',
    [theme.breakpoints.down('md')]: {
      width: '30vw',
    },
    [theme.breakpoints.down('sm')]: {
      width: '85vw',
    },
  },
  chatList: {
    flexDirection: 'column',
    height: '83%',
    overflow: 'scroll',
    padding: theme.spacing(0, 1),
  },
  hostTag: {
    marginLeft: theme.spacing(0.5),
    color: theme.palette.common.basePink,
    fontWeight: 700,
  },
  inputContainer: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.common.greyCard,
  },
  messageContent: {
    fontWeight: 400,
    color: theme.palette.common.ghostWhite,
    wordWrap: 'break-word',
  },
  messageTimeStamp: {
    color: '#666666',
    fontSize: '0.75rem',
    marginLeft: theme.spacing(0.5),
  },
  sendersName: {
    color: theme.palette.common.ghostWhite,
    fontWeight: 700,
  },
}))

const EventChatBox = ({ eventId, hostId, userId }) => {
  const classes = createStyles()
  const [message, setMessage] = useState('')
  const [list, setList] = useState(null)

  const { data: chatMessages } = useSubscription(listenToEventChatMessages, {
    variables: {
      event_id: eventId,
    },
    skip: !eventId,
  })

  const [insertEventChatMessageMutation] = useMutation(insertEventChatMessage)

  useEffect(() => {
    if (chatMessages && !list) {
      setList(chatMessages)
    }
  }, [chatMessages])

  const getNumberOfRows = () => {
    const charsPerLine = 40
    const numRows = Math.ceil(message.length / charsPerLine)
    return numRows === 0 ? 1 : numRows
  }

  const sendMessage = (event) => {
    // keyCode 13 is 'enter'
    if (event.keyCode === 13) {
      insertEventChatMessageMutation({
        variables: {
          content: message,
          event_id: eventId,
          user_id: userId,
        },
      })
      setMessage('')
    }
  }

  return (
    <Grid container direction="column" alignItems="space-between" className={classes.chatContainer}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.chatBoxTitle}
      >
        Chat with Everyone
      </Grid>
      <List dense className={classes.chatList}>
        {chatMessages &&
          chatMessages.event_group_chat_messages.length &&
          chatMessages.event_group_chat_messages.map((message) => {
            const { content: messageContent, created_at, sender_id, user } = message
            const sendersFirstName = user.name && user.name.split(' ')[0]
            const senderIsHost = parseInt(hostId, 10) === parseInt(sender_id, 10)
            const messageSentAt = formatChatMessagesDate(created_at)
            return (
              <ListItem dense>
                <ListItemText
                  primary={
                    <Grid container alignItems="flex-end">
                      <span className={classes.sendersName}>{sendersFirstName}</span>{' '}
                      {senderIsHost ? <span className={classes.hostTag}> • Host</span> : null}{' '}
                      <span className={classes.messageTimeStamp}>at {messageSentAt}</span>
                    </Grid>
                  }
                  secondary={<span className={classes.messageContent}>{messageContent}</span>}
                  secondaryTypographyProps={{ style: { whiteSpace: 'normal' } }}
                />
              </ListItem>
            )
          })}
      </List>
      <Grid container direction="column" className={classes.inputContainer}>
        <TextField
          autoComplete={false}
          id="message"
          required
          fullWidth
          placeholder="Jump in and say hello 👋 "
          className={classes.input}
          value={message}
          multiline
          rows={getNumberOfRows()}
          onKeyDown={sendMessage}
          InputProps={{ style: { marginTop: 0, padding: 0 } }}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Grid>
    </Grid>
  )
}

export default EventChatBox
