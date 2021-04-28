import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Grid, List, ListItem, ListItemText, TextField } from '@material-ui/core'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import { makeStyles } from '@material-ui/styles'
import { insertEventChatMessage } from '../gql/mutations'
import { constants, formatChatMessagesDate } from '../utils'
import Avatar from '@material-ui/core/Avatar'
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
    bottom: bottomNavBarHeight + 40,
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
    [theme.breakpoints.down('xs')]: {
      width: '85vw',
    },
  },
  chatList: {
    flexDirection: 'column',
    height: '83%',
    overflow: 'auto',
    padding: theme.spacing(0, 1),
  },
  hiRightNowTeamName: {
    color: theme.palette.common.sunray,
    fontWeight: 700,
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
  minimizeChatIcon: {
    color: theme.palette.common.ghostWhite,
    fontSize: '2rem',
    position: 'absolute',
    left: 'auto',
    right: 10,
    '&:hover': {
      color: theme.palette.common.basePink,
      cursor: 'pointer',
    },
  },
  sendersName: {
    color: theme.palette.common.ghostWhite,
    fontWeight: 700,
  },
}))

const EventChatBox = ({
  eventId,
  hostId,
  messages,
  toggleChat = () => {},
  userId,
  customClasses = null,
  /** Remove the default toggle header with your own custom one */
  customHeader = null,
  /** Show timestamps for each chat messages */
  showTimeStamps = true,
  /** Show profile pictures of users in the chat */
  showAvatar = false,
  /** Manually add a placeholder in the input field */
  inputPlaceholder = '',
}) => {
  const classes = customClasses ? customClasses : createStyles()
  const [message, setMessage] = useState('')
  const [list, setList] = useState(null)

  const [insertEventChatMessageMutation] = useMutation(insertEventChatMessage)

  useEffect(() => {
    const chatList = document.getElementById('chat-list')
    chatList.scrollTop = chatList.scrollHeight
    if (messages && !list) {
      setList(messages)
    }
  }, [messages, list])

  const getNumberOfRows = (msg) => {
    const charsPerLine = 40
    const numRows = Math.ceil(msg.length / charsPerLine)
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
    <Grid container direction="column" className={classes.chatContainer}>
      {customHeader ? (
        customHeader
      ) : (
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          className={classes.chatBoxTitle}
        >
          Chat with Everyone
          <KeyboardArrowDownIcon className={classes.minimizeChatIcon} onClick={toggleChat} />
        </Grid>
      )}

      <List dense className={classes.chatList} id="chat-list">
        {messages && messages.length ? (
          messages.map((message) => {
            const { content: messageContent, created_at, sender_id, user } = message
            const senderIsHost = parseInt(hostId, 10) === parseInt(sender_id, 10)
            const messageSentAt = formatChatMessagesDate(created_at)
            return (
              <ListItem key={created_at} dense>
                <ListItemText
                  primary={
                    <Grid container alignItems="flex-end">
                      <span className={classes.sendersName}>{user.first_name}</span>{' '}
                      {senderIsHost ? <span className={classes.hostTag}> • Host</span> : null}{' '}
                      {showTimeStamps && (
                        <span className={classes.messageTimeStamp}>at {messageSentAt}</span>
                      )}
                    </Grid>
                  }
                  secondary={
                    <span className={classes.messageContent}>
                      {showAvatar && (
                        <Avatar
                          className={classes.chatAvatar}
                          component="b"
                          alt=""
                          style={Object.assign(
                            { top: 0 },
                            getNumberOfRows(messageContent) > 1
                              ? {
                                  top: '.9rem',
                                  left: '.2rem',
                                }
                              : {}
                          )}
                          src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80"
                        />
                      )}
                      <span>{messageContent}</span>
                    </span>
                  }
                  secondaryTypographyProps={{ style: { whiteSpace: 'normal' } }}
                />
              </ListItem>
            )
          })
        ) : (
          <ListItem key="hrn-default-message" dense>
            <ListItemText
              primary={
                <Grid container alignItems="flex-end">
                  <span className={classes.hiRightNowTeamName}>
                    <span role="img" aria-label="sparkle">
                      ✨
                    </span>{' '}
                    Hi Right Now Team{' '}
                    <span role="img" aria-label="sparkle">
                      ✨
                    </span>
                  </span>{' '}
                </Grid>
              }
              secondary={
                <span className={classes.messageContent}>
                  Welcome to the Event! Be the first one to say hi and get the conversation going :)
                </span>
              }
              secondaryTypographyProps={{ style: { whiteSpace: 'normal' } }}
            />
          </ListItem>
        )}
      </List>
      <Grid container direction="column" className={classes.inputContainer}>
        <TextField
          autoComplete="off"
          id="message"
          required
          fullWidth
          placeholder={inputPlaceholder || 'Jump in and say hello 👋 '}
          className={classes.input}
          value={message}
          multiline
          rows={getNumberOfRows(message)}
          onKeyDown={sendMessage}
          InputProps={{ disableUnderline: true, style: { marginTop: 0, padding: 0 } }}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Grid>
    </Grid>
  )
}

export default EventChatBox
