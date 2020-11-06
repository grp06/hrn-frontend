import React, { useEffect, useRef, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'

import { GroupVideoChatBottomPanel } from '.'
import BeachAccessIcon from '../../assets/beachAccess.svg'
import PersonIcon from '../../assets/greyPerson.svg'
import MicOffIcon from '../../assets/micOff.svg'
import { Loading } from '../../common'
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
    left: '0%',
    right: 'auto',
    bottom: '-0.05%',
    width: '100%',
    backgroundColor: 'rgb(36,37,38,0.7)',
    padding: theme.spacing(0.75, 0),
  },
  usersNameDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: '12px',
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
    marginRight: '10px',
    display: 'none',
  },
  beachAccessIconDiv: {
    backgroundImage: `url(${BeachAccessIcon})`,
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    width: '25px',
    height: '25px',
    marginRight: '5px',
    display: 'inline',
  },
}))

const EventGroupVideoChat = () => {
  const classes = useStyles()
  const history = useHistory()
  const { appLoading } = useAppContext()
  const { event } = useEventContext()
  const { user } = useUserContext()
  const {
    onlineEventUsers,
    setUserHasEnabledCameraAndMic,
    userHasEnabledCameraAndMic,
  } = useUserEventStatusContext()
  const { startGroupVideoChatTwilio } = useGroupVideoChatTwilio()
  const arrayOfOnlineUserIds = useRef([])
  const [groupChatToken, setGroupChatToken] = useState(null)
  const [groupChatRoom, setGroupChatRoom] = useState(null)
  const { host_id, id: event_id, status: event_status } = event
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
      usersNamePTag.appendChild(usersNameNode)
      usersNamePTag.setAttribute('class', classes.usersNameInVideo)
      usersNameDiv.setAttribute('class', classes.usersNameDiv)
      if (thisIsHostDiv) {
        const beachAccessDiv = thisIsHostDiv && document.createElement('div')
        beachAccessDiv.setAttribute('class', classes.beachAccessIconDiv)
        usersNameDiv.appendChild(beachAccessDiv)
      }
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
    const videoDevice = userIsHost ? { deviceId: localStoragePreferredVideoId } : false
    const myRoom = await connect(groupChatToken, {
      maxAudioBitrate: 16000,
      audio: audioDevice,
      video: videoDevice,
      dominantSpeaker: true,
    })
    setGroupChatRoom(myRoom)
  }

  const getTwilioToken = async () => {
    const res = await getToken(`${event_id}-post-event`, user_id).then((response) =>
      response.json()
    )
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

  useEffect(() => {
    if (event && event_id) {
      if (event_status === 'complete') {
        return history.push(`/events/${event_id}/event-complete`)
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
    if (event_id && user_id && userHasEnabledCameraAndMic) {
      getTwilioToken()
    }
  }, [event_id, user_id, userHasEnabledCameraAndMic])

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

  if (appLoading || Object.keys(event).length < 2) {
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
      <GroupVideoChatBottomPanel
        event_id={event_id}
        setUserHasEnabledCameraAndMic={setUserHasEnabledCameraAndMic}
        userIsHost={userIsHost}
        twilioGroupChatRoom={groupChatRoom}
      />
    </>
  )
}

export default EventGroupVideoChat
