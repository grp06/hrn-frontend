import React, { useEffect, useRef, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'

import { getToken } from '../../helpers'
import { GroupVideoChatBottomPanel } from '.'
import {
  useAppContext,
  useEventContext,
  useUserContext,
  useUserEventStatusContext,
} from '../../context'
import { useGroupVideoChatTwilio } from '../../hooks'
import PersonIcon from '../../assets/greyPerson.svg'
import MicOffIcon from '../../assets/micOff.svg'

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
  },
  usersNameContainer: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 99999,
    top: 'auto',
    left: '0%',
    right: 'auto',
    bottom: '-0.05%',
    width: '100%',
    backgroundColor: 'rgb(36,37,38,0.7)',
    padding: theme.spacing(0.75, 0),
  },
  usersNameInVideo: {
    fontFamily: 'Muli',
    fontSize: '1.25rem',
    fontWeight: '400',
    color: theme.palette.common.ghostWhite,
    margin: 0,
    marginLeft: '12px',
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
    marginRight: '10px',
    display: 'none',
  },
}))

const EventGroupVideoChat = () => {
  const classes = useStyles()
  const history = useHistory()
  const { appLoading } = useAppContext()
  const { event } = useEventContext()
  const { user } = useUserContext()
  const { setUserHasEnabledCameraAndMic, onlineEventUsers } = useUserEventStatusContext()
  const { startGroupVideoChatTwilio } = useGroupVideoChatTwilio()
  const arrayOfOnlineUserIds = useRef([])
  const [groupChatToken, setGroupChatToken] = useState(null)
  const [groupChatRoom, setGroupChatRoom] = useState(null)
  const { id: event_id, status: event_status } = event
  const { id: userId } = user

  const getNumRowsAndCols = (numberOfVideos) => {
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
      const usersName = eventUser.user[0].name
      const divElementWithUsersId = arrayOfDivElementsInVideoGrid.filter(
        (divElement) => parseInt(divElement.id, 10) === usersId
      )
      if (divElementWithUsersId.length) {
        return
      }
      const newDivElement = document.createElement('div')
      const usersNameDiv = document.createElement('div')
      const usersNamePTag = document.createElement('p')
      const usersNameNode = document.createTextNode(usersName)
      const usersMicOffDiv = document.createElement('div')
      usersMicOffDiv.setAttribute('id', `${usersId}-mic-off-icon-div`)
      usersMicOffDiv.setAttribute('class', classes.micOffIconDiv)
      usersNamePTag.appendChild(usersNameNode)
      usersNamePTag.setAttribute('class', classes.usersNameInVideo)
      usersNameDiv.appendChild(usersNamePTag)
      usersNameDiv.appendChild(usersMicOffDiv)
      usersNameDiv.setAttribute('class', classes.usersNameContainer)
      usersNameDiv.setAttribute('id', `${usersId}-name-container`)
      newDivElement.setAttribute('id', usersId)
      newDivElement.setAttribute('class', classes.box)
      newDivElement.style.height = height
      newDivElement.style.width = width
      newDivElement.appendChild(usersNameDiv)
      videoGrid.appendChild(newDivElement)
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

  useEffect(() => {
    if (event && event_id) {
      if (event_status === 'complete') {
        return history.push(`/events/${event_id}/event-complete`)
      }
    }
  }, [event_status])

  useEffect(() => {
    if (onlineEventUsers && onlineEventUsers.length) {
      createIndividualVideoDiv()
      cleanupEmptyVideoDivs()
    }
    console.log('onlineEventUsers ->', onlineEventUsers)
  }, [onlineEventUsers])

  // get the token
  useEffect(() => {
    const getTwilioToken = async () => {
      const res = await getToken(`${event_id}-post-event`, userId).then((response) =>
        response.json()
      )
      console.log('getTwilioToken res ->', res)
      setGroupChatToken(res.token)
    }
    if (event_id && userId) {
      getTwilioToken()
    }
  }, [event_id, userId])

  // After getting your token you get the permissions and create localTracks
  // You also get your groupChatRoom
  useEffect(() => {
    const connectToGroupVideoChatRoom = async () => {
      console.log('calling CONNECT')
      const localStoragePreferredVideoId = localStorage.getItem('preferredVideoId')
      const localStoragePreferredAudioId = localStorage.getItem('preferredAudioId')
      // const audioDevice =
      //   process.env.NODE_ENV === 'production' ? { deviceId: localStoragePreferredAudioId } : false

      console.log('process.env.NODE_ENV', process.env.NODE_ENV)
      // console.log('audioDevice', audioDevice)
      console.log('groupChatToken ->', groupChatToken)

      const myRoom = await connect(groupChatToken, {
        maxAudioBitrate: 16000,
        video: { deviceId: localStoragePreferredVideoId },
        audio: { deviceId: localStoragePreferredAudioId },
        // audio: false,
        // video: false,
      })
      console.log('myRoom ->', myRoom)
      console.log('setting groupChatRoom')
      setGroupChatRoom(myRoom)
    }

    if (groupChatToken) {
      connectToGroupVideoChatRoom()
    }
  }, [groupChatToken])

  useEffect(() => {
    if (groupChatRoom) {
      const videoGrid = document.getElementById('videoBox')
      const arrayOfDivElementsInVideoGrid = Array.from(videoGrid.children)
      console.log('arrayOfDivElementsInVideoGrid ->', arrayOfDivElementsInVideoGrid)
      if (arrayOfDivElementsInVideoGrid.length) {
        console.warn('starting twilio')
        startGroupVideoChatTwilio(groupChatRoom)
      }
    }
  }, [groupChatRoom])

  return (
    <>
      <Grid
        id="videoBox"
        container
        justify="space-around"
        alignItems="center"
        className={classes.videoBox}
      />
      <GroupVideoChatBottomPanel
        event={event}
        setUserHasEnabledCameraAndMic={setUserHasEnabledCameraAndMic}
        userId={userId}
        twilioGroupChatRoom={groupChatRoom}
      />
    </>
  )
}

export default EventGroupVideoChat
