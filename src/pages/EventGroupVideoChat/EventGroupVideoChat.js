import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { getToken } from '../../helpers'
import { makeStyles } from '@material-ui/styles'

import { GroupVideoChatBottomPanel } from '.'
import {
  useAppContext,
  useEventContext,
  useUserContext,
  useUserEventStatusContext,
} from '../../context'
import { useGroupVideoChatTwilio } from '../../hooks'
import PersonIcon from '../../assets/greyPerson.svg'

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
  usersNameInVideo: {
    position: 'absolute',
    zIndex: 99999,
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: '1%',
    fontFamily: 'Muli',
    fontSize: '1.75rem',
    fontWeight: '600',
    color: theme.palette.common.basePurple,
    textAlign: 'center',
    width: '100%',
  },
  videoBox: {
    width: '95%',
    height: '90vh',
    backgroundColor: 'blue',
    borderRadius: '4px',
    padding: theme.spacing(3),
    overflowY: 'scroll',
    margin: theme.spacing(0, 'auto'),
  },
}))

const EventGroupVideoChat = () => {
  const classes = useStyles()
  const { appLoading } = useAppContext()
  const { event } = useEventContext()
  const { user } = useUserContext()
  const { setUserHasEnabledCameraAndMic, onlineEventUsers } = useUserEventStatusContext()
  const { startGroupVideoChatTwilio } = useGroupVideoChatTwilio()
  const [groupChatToken, setGroupChatToken] = useState(null)
  const [groupChatRoom, setGroupChatRoom] = useState(null)
  const { id: event_id } = event
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
      const usersNameDiv = document.createElement('p')
      const usersNameNode = document.createTextNode(usersName)
      usersNameDiv.appendChild(usersNameNode)
      usersNameDiv.setAttribute('class', classes.usersNameInVideo)
      newDivElement.setAttribute('id', usersId)
      newDivElement.setAttribute('class', classes.box)
      newDivElement.style.height = height
      newDivElement.style.width = width
      newDivElement.appendChild(usersNameDiv)
      videoGrid.appendChild(newDivElement)
    })
  }

  useEffect(() => {
    if (onlineEventUsers && onlineEventUsers.length) {
      createIndividualVideoDiv()
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
        // video: { deviceId: localStoragePreferredVideoId },
        // audio: { deviceId: localStoragePreferredAudioId },
        audio: false,
        video: false,
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
      <Grid id="videoBox" container justify="space-around" className={classes.videoBox} />
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
