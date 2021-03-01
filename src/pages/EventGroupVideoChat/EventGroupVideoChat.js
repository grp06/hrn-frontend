import React, { useEffect, useRef, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'

import { GroupVideoChatBottomPanel } from '.'
import PersonIcon from '../../assets/greyPerson.svg'
import MicOffIcon from '../../assets/micOff.svg'
import { EventChatBox, Loading } from '../../common'
import {
  useAppContext,
  useEventContext,
  useUserContext,
  useUserEventStatusContext,
} from '../../context'
import { getToken } from '../../helpers'
import { useGroupVideoChatTwilio } from '../../hooks'
import { CameraAndMicSetupScreen } from '../Lobby'

const { connect } = require('twilio-video')

const useStyles = makeStyles((theme) => ({
  box: {
    position: 'relative',
    backgroundImage: `url(${PersonIcon})`,
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    '& video': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    margin: theme.spacing(0.5),
  },
  usersNameContainer: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 9,
    top: 'auto',
    left: '1%',
    right: 'auto',
    bottom: '1%',
    width: 'auto',
    height: '25px',
    borderRadius: '4px',
    backgroundColor: 'rgb(36,37,38,0.7)',
    padding: theme.spacing(0.5, 1),
  },
  usersNameDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  usersNameInVideo: {
    fontFamily: 'Muli',
    fontSize: '1.25rem',
    fontWeight: '400',
    color: theme.palette.common.ghostWhite,
    margin: 0,
  },
  videoBox: {
    width: '95%',
    height: '90vh',
    borderRadius: '4px',
    padding: theme.spacing(3),
    overflowY: 'scroll',
    margin: theme.spacing(0, 'auto'),
  },
  micOffIconDiv: {
    backgroundImage: `url(${MicOffIcon})`,
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    width: '25px',
    height: '25px',
    marginRight: '-4px',
    marginLeft: '4px',
    display: 'none',
  },
  hostTag: {
    color: theme.palette.common.basePink,
    fontWeight: 700,
    fontFamily: 'Muli',
    marginRight: '5px',
    fontSize: '1.25rem',
  },
}))

const EventGroupVideoChat = () => {
  const classes = useStyles()
  const history = useHistory()
  const {
    event,
    eventChatMessages,
    numberOfUnreadChatMessages,
    setNumberOfReadChatMessages,
    eventContextLoading,
  } = useEventContext()
  const { user, userContextLoading } = useUserContext()
  const {
    onlineEventUsers,
    setUserHasEnabledCameraAndMic,
    userHasEnabledCameraAndMic,
  } = useUserEventStatusContext()
  const { startGroupVideoChatTwilio } = useGroupVideoChatTwilio()
  const arrayOfOnlineUserIds = useRef([])
  const [chatIsOpen, setChatIsOpen] = useState(true)
  const [groupChatToken, setGroupChatToken] = useState(null)
  const [groupChatRoom, setGroupChatRoom] = useState(null)
  const { host_id, status: event_status, id: eventId } = event
  const { id: user_id, name: usersName } = user
  const userIsHost = parseInt(host_id, 10) === parseInt(user_id, 10)

  const getNumRowsAndCols = (numberOfVideos) => {
    if (numberOfVideos > 9) {
      return { width: '24%', height: '24%' }
    }
    const width = numberOfVideos <= 4 ? '49%' : '32%'
    const height = numberOfVideos <= 6 ? '49%' : '32%'
    return { width, height }
  }

  const createIndividualVideoDiv = () => {
    const { width, height } = getNumRowsAndCols(onlineEventUsers.length)
    const videoGrid = document.getElementById('videoBox')
    const arrayOfDivElementsInVideoGrid = Array.from(videoGrid.children)
    onlineEventUsers.forEach((eventUser) => {
      const usersId = eventUser.user[0].id
      const thisIsHostDiv = parseInt(host_id, 10) === parseInt(usersId, 10)
      const usersFirstName = eventUser.user[0].name.split(' ')[0]
      const divElementWithUsersId = arrayOfDivElementsInVideoGrid.filter(
        (divElement) => parseInt(divElement.id, 10) === usersId
      )
      if (divElementWithUsersId.length) {
        return
      }
      const newDivElement = document.createElement('div')
      const usersNameContainer = document.createElement('div')
      const usersNameDiv = document.createElement('div')
      const usersNamePTag = document.createElement('p')
      const usersNameNode = document.createTextNode(usersFirstName)
      const usersMicOffDiv = document.createElement('div')
      if (thisIsHostDiv) {
        const hostTagPTag = thisIsHostDiv && document.createElement('p')
        const hostTagNode = document.createTextNode('• Host')
        hostTagPTag.setAttribute('class', classes.hostTag)
        hostTagPTag.appendChild(hostTagNode)
        usersNameDiv.appendChild(hostTagPTag)
      }
      usersNamePTag.appendChild(usersNameNode)
      usersNamePTag.setAttribute('class', classes.usersNameInVideo)
      usersNameDiv.setAttribute('class', classes.usersNameDiv)
      usersNameDiv.appendChild(usersNamePTag)
      usersMicOffDiv.setAttribute('id', `${usersId}-mic-off-icon-div`)
      usersMicOffDiv.setAttribute('class', classes.micOffIconDiv)
      usersNameContainer.appendChild(usersNameDiv)
      usersNameContainer.appendChild(usersMicOffDiv)
      usersNameContainer.setAttribute('class', classes.usersNameContainer)
      usersNameContainer.setAttribute('id', `${usersId}-name-container`)
      newDivElement.setAttribute('id', usersId)
      newDivElement.setAttribute('class', classes.box)
      newDivElement.style.height = height
      newDivElement.style.width = width
      newDivElement.appendChild(usersNameContainer)
      if (thisIsHostDiv) {
        videoGrid.insertBefore(newDivElement, videoGrid.firstChild)
      } else {
        videoGrid.appendChild(newDivElement)
        usersMicOffDiv.style.display = 'inline'
      }
    })
  }

  const cleanupEmptyVideoDivs = () => {
    if (onlineEventUsers.length > arrayOfOnlineUserIds.current.length) {
      // since this func gets called after making divs, we already made the div
      // and just need to update arrayOfOnlineUserIds
      const userIds = onlineEventUsers.map((eventUser) => eventUser.user[0].id)
      console.log('userIds ->', userIds)
      arrayOfOnlineUserIds.current = userIds
    } else if (onlineEventUsers.length < arrayOfOnlineUserIds.current.length) {
      const userIds = onlineEventUsers.map((eventUser) => eventUser.user[0].id)
      arrayOfOnlineUserIds.current.forEach((id) => {
        if (userIds.indexOf(id) < 0) {
          const usersOldVideoDiv = document.getElementById(id)
          usersOldVideoDiv.parentNode.removeChild(usersOldVideoDiv)
        }
      })
      arrayOfOnlineUserIds.current = userIds
    }
  }

  const connectToGroupVideoChatRoom = async () => {
    console.log('calling CONNECT')
    const localStoragePreferredVideoId = localStorage.getItem('preferredVideoId')
    const localStoragePreferredAudioId = localStorage.getItem('preferredAudioId')
    const audioDevice = userIsHost ? { deviceId: localStoragePreferredAudioId } : false
    const videoDevice = { deviceId: localStoragePreferredVideoId }
    const myRoom = await connect(groupChatToken, {
      maxAudioBitrate: 16000,
      audio: audioDevice,
      video: videoDevice,
      dominantSpeaker: true,
    })
    setGroupChatRoom(myRoom)
  }

  const getTwilioToken = async () => {
    const res = await getToken(`${eventId}-post-event`, user_id).then((response) => response.json())
    console.log('getTwilioToken res ->', res)
    setGroupChatToken(res.token)
  }

  const resizeActiveVideoDivs = (numberOfActiveVideoDivs) => {
    const { width, height } = getNumRowsAndCols(numberOfActiveVideoDivs)
    console.log('width ->', width)
    console.log('height ->', height)
    const videoGrid = document.getElementById('videoBox')
    const arrayOfDivElementsInVideoGrid = Array.from(videoGrid.children)
    arrayOfDivElementsInVideoGrid.forEach((divElement) => {
      divElement.style.height = height
      divElement.style.width = width
    })
  }

  const toggleChat = () => {
    setChatIsOpen((prevState) => {
      if (prevState === true && eventChatMessages && eventChatMessages.length) {
        setNumberOfReadChatMessages(eventChatMessages.length)
      }
      return !prevState
    })
  }

  useEffect(() => {
    if (event && eventId) {
      if (event_status === 'complete') {
        return history.push(`/events/${eventId}/event-complete`)
      }
    }
  }, [event_status])

  useEffect(() => {
    if (onlineEventUsers && onlineEventUsers.length && userHasEnabledCameraAndMic) {
      createIndividualVideoDiv()
      cleanupEmptyVideoDivs()
      resizeActiveVideoDivs(onlineEventUsers.length)
    }
    console.log('onlineEventUsers ->', onlineEventUsers)
  }, [onlineEventUsers, userHasEnabledCameraAndMic])

  // get the token
  useEffect(() => {
    if (eventId && user_id && userHasEnabledCameraAndMic) {
      getTwilioToken()
    }
  }, [eventId, user_id, userHasEnabledCameraAndMic])

  // After getting your token you get the permissions and create localTracks
  // You also get your groupChatRoom
  useEffect(() => {
    if (groupChatToken) {
      connectToGroupVideoChatRoom()
    }
  }, [groupChatToken])

  useEffect(() => {
    if (groupChatRoom) {
      const videoGrid = document.getElementById('videoBox')
      const arrayOfDivElementsInVideoGrid = Array.from(videoGrid.children)
      if (arrayOfDivElementsInVideoGrid.length) {
        console.warn('starting twilio')
        startGroupVideoChatTwilio(groupChatRoom)
      }
    }
  }, [groupChatRoom])

  if (userContextLoading || eventContextLoading) {
    return <Loading />
  }

  if (!userHasEnabledCameraAndMic) {
    return <CameraAndMicSetupScreen usersName={usersName} />
  }

  return (
    <>
      <Grid
        id="videoBox"
        container
        justify="space-around"
        alignItems="center"
        className={classes.videoBox}
      />
      {chatIsOpen ? (
        <EventChatBox
          eventId={eventId}
          hostId={host_id}
          messages={eventChatMessages}
          toggleChat={toggleChat}
          userId={user_id}
        />
      ) : null}
      <GroupVideoChatBottomPanel
        chatIsOpen={chatIsOpen}
        event_id={eventId}
        numberOfUnreadChatMessages={numberOfUnreadChatMessages}
        setUserHasEnabledCameraAndMic={setUserHasEnabledCameraAndMic}
        userIsHost={userIsHost}
        toggleChat={toggleChat}
        twilioGroupChatRoom={groupChatRoom}
      />
    </>
  )
}

export default EventGroupVideoChat
