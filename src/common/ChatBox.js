import React, { useState, useEffect } from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import { insertPersonalChatMessage } from '../gql/mutations'
import { listenToChatMessages } from '../gql/subscriptions'
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
    position: 'absolute',
    bottom: bottomNavBarHeight + 75,
    right: '1%',
    display: 'block',
    width: '25vw',
    height: '50vh',
    borderRadius: '4px',
    backgroundColor: theme.palette.common.greyCard,
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

const ChatBox = ({ messages, myRound }) => {
  const classes = createStyles()
  const { event_id, partner: myPartner, partner_id, user_id } = myRound
  const { name: myPartnersName } = (myPartner && Object.keys(myPartner).length && myPartner) || ''
  const [message, setMessage] = useState('')
  const [list, setList] = useState(null)
  const myPartnersFirstName = myPartnersName && myPartnersName.split(' ')[0]

  const [insertPersonalChatMessageMutation] = useMutation(insertPersonalChatMessage, {
    user_id,
    partner_id,
    content: message,
  })

  useEffect(() => {
    const chatList = document.getElementById('chat-list')
    chatList.scrollTop = chatList.scrollHeight
    if (messages && !list) {
      setList(messages)
    }
  }, [messages])

  const getNumberOfRows = () => {
    const charsPerLine = 40
    const numRows = Math.ceil(message.length / charsPerLine)
    return numRows === 0 ? 1 : numRows
  }

  const sendMessage = (event) => {
    // keyCode 13 is 'enter'
    if (event.keyCode === 13) {
      insertPersonalChatMessageMutation({
        variables: {
          user_id,
          partner_id,
          content: message,
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
        Chat with {myPartnersFirstName}
      </Grid>
      <List dense className={classes.chatList} id="chat-list">
        {messages &&
          messages.length &&
          messages.map((message) => {
            const { content: messageContent, created_at, user } = message
            const sendersFirstName = user.name && user.name.split(' ')[0]
            const messageSentAt = formatChatMessagesDate(created_at)
            return (
              <ListItem dense>
                <ListItemText
                  primary={
                    <Grid container alignItems="flex-end">
                      <span className={classes.sendersName}>{sendersFirstName}</span>{' '}
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
          placeholder="Type your message here ..."
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

export default ChatBox
