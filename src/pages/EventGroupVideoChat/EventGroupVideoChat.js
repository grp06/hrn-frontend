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
import { useTwilio } from '../../hooks'

const { connect } = require('twilio-video')

const useStyles = makeStyles((theme) => ({
  videoBox: {
    width: '95%',
    height: '90vh',
    backgroundColor: 'blue',
    borderRadius: '4px',
    padding: theme.spacing(3),
    overflowY: 'scroll',
    margin: theme.spacing(0, 'auto'),
  },
  box: {
    backgroundColor: 'yellow',
    borderRadius: '4px',
  },
}))

const EventGroupVideoChat = () => {
  const classes = useStyles()
  const { appLoading } = useAppContext()
  const { event } = useEventContext()
  const { user } = useUserContext()
  const { setUserHasEnabledCameraAndMic } = useUserEventStatusContext()
  const { startTwilio } = useTwilio()
  const [groupChatToken, setGroupChatToken] = useState(null)
  const [groupChatRoom, setGroupChatRoom] = useState(null)
  const { id: event_id } = event
  const { id: user_id } = user

  const getNumRowsAndCols = (numberOfVideos) => {
    const width = numberOfVideos <= 4 ? '49%' : '32%'
    const height = numberOfVideos <= 6 ? '49%' : '32%'
    return { width, height }
  }

  const { width, height } = getNumRowsAndCols(4)

  // get the token

  useEffect(() => {
    const getTwilioToken = async () => {
      const res = await getToken(`${event_id}-post-event`, user_id).then((response) =>
        response.json()
      )
      console.log('getTwilioToken res ->', res)
      setGroupChatToken(res.token)
    }
    getTwilioToken()
  }, [])

  // After getting your token you get the permissions and create localTracks
  // You also get your groupChatRoom
  useEffect(() => {
    if (groupChatToken) {
      const connectToGroupVideoChatRoom = async () => {
        console.log('calling CONNECT')
        const localStoragePreferredVideoId = localStorage.getItem('preferredVideoId')
        const localStoragePreferredAudioId = localStorage.getItem('preferredAudioId')
        const audioDevice =
          process.env.NODE_ENV === 'production' ? { deviceId: localStoragePreferredAudioId } : false

        console.log('process.env.NODE_ENV', process.env.NODE_ENV)
        console.log('audioDevice', audioDevice)

        const myRoom = await connect(groupChatToken, {
          maxAudioBitrate: 16000,
          video: { deviceId: localStoragePreferredVideoId },
          audio: audioDevice,
        })
        console.log('setting groupChatRoom')
        setGroupChatRoom(myRoom)
      }
      connectToGroupVideoChatRoom()
    }
  }, [groupChatToken])

  useEffect(() => {
    if (groupChatRoom) {
      console.warn('starting twilio')
      startTwilio(groupChatRoom)
    }
  }, [groupChatRoom])

  return (
    <>
      <Grid container justify="space-around" className={classes.videoBox}>
        <div className={classes.box} style={{ width, height }} />
        <div className={classes.box} style={{ width, height }} />
        <div className={classes.box} style={{ width, height }} />
        <div className={classes.box} style={{ width, height }} />
        <div className={classes.box} style={{ width, height }} />
        <div className={classes.box} style={{ width, height }} />
        <div className={classes.box} style={{ width, height }} />
        <div className={classes.box} style={{ width, height }} />
        <div className={classes.box} style={{ width, height }} />
      </Grid>
      <GroupVideoChatBottomPanel
        event={event}
        setUserHasEnabledCameraAndMic={setUserHasEnabledCameraAndMic}
        userId={user_id}
      />
    </>
  )
}

export default EventGroupVideoChat
