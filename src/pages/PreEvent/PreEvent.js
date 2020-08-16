import React, { useState, useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import { useAppContext } from '../../context/useAppContext'
import { getToken } from '../../helpers'
import { CameraDisabledBanner } from '../../common'
import { usePreEventTwilio, useGetCameraAndMicStatus } from '../../hooks'
import { constants } from '../../utils'

const { maxNumUsersPerRoom } = constants

const { createLocalTracks, connect } = require('twilio-video')

const useStyles = makeStyles((theme) => ({
  hostVid: {
    width: '100%',
    display: 'flex',
    '& video': {
      width: '100%',
      height: 'calc(100vh)',
    },
  },
  preEventWrapper: {
    height: '100vh',
  },
}))

const PreEvent = ({ match }) => {
  const { id: eventId } = match.params
  const classes = useStyles()
  const history = useHistory()
  const { user, event, app, setCameraAndMicPermissions } = useAppContext()
  const { userId, role } = user
  const { permissions } = app
  const [isGUMErrorModalActive, setIsGUMErrorModalActive] = useState(false)
  const [GUMError, setGUMError] = useState('')
  const [roomTokens, setRoomTokens] = useState([])
  const [myRoomNumber, setMyRoomNumber] = useState(null)
  const [numRooms, setNumRooms] = useState(null)
  const { startPreEventTwilio } = usePreEventTwilio()
  const eventSet = Object.keys(event).length > 1
  const [onlineUsers, setOnlineUsers] = useState(null)
  const hasCheckedCamera = useRef()
  const micOrCameraIsDisabled = Object.values(permissions).indexOf(false) > -1

  useGetCameraAndMicStatus(hasCheckedCamera.current)
  hasCheckedCamera.current = true
  useEffect(() => {
    if (eventSet) {
      const { status } = event

      if (micOrCameraIsDisabled) {
        return history.push(`/events/${eventId}`)
      }

      if (status === 'in-between-rounds') {
        console.log('force to video room')
        return history.push(`/events/${eventId}/video-room`)
      }

      if (status !== 'pre-event') {
        return history.push(`/events/${eventId}`)
      }
    }
  }, [event])

  useEffect(() => {
    if (eventSet && userId && !onlineUsers) {
      const getOnlineUsers = async () => {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/rooms/get-online-event-users/${eventId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
          }
        )
        const response = await res.json()
        console.warn('ONLINE USERS = ', onlineUsers)
        setOnlineUsers(response.data)
      }
      getOnlineUsers()
    }
  }, [event, userId, onlineUsers])

  useEffect(() => {
    if (onlineUsers) {
      const numOnlineUsers = onlineUsers.length

      if (numOnlineUsers < maxNumUsersPerRoom) {
        setMyRoomNumber(1)
        return setNumRooms(1)
      }
      // get online users, divide by 50 and round up = number of rooms
      const numberOfRooms = Math.ceil(numOnlineUsers / maxNumUsersPerRoom)
      const usersPerRoom = Math.ceil(numOnlineUsers / numberOfRooms)
      const currentUserIndex = onlineUsers.indexOf(userId)
      const roomNumber = Math.floor(currentUserIndex / usersPerRoom) + 1

      setMyRoomNumber(roomNumber)
      setNumRooms(numberOfRooms)
    }
  }, [onlineUsers])

  useEffect(() => {
    if (userId && myRoomNumber !== null) {
      const setupTokens = async () => {
        const isEventHost = event.host_id === userId
        if (!isEventHost) {
          const tokenResp = await getToken(`${eventId}-pre-event-${myRoomNumber}`, userId)
          const tokenJson = await tokenResp.json()
          return setRoomTokens([tokenJson.token])
        }

        const tokenPromises = []

        // eslint-disable-next-line no-restricted-syntax
        for (let i = 0; i < numRooms; i++) {
          tokenPromises.push(getToken(`${eventId}-pre-event-${i + 1}`, userId))
        }
        const tokenPromisesResponse = await Promise.all(tokenPromises)
        const hostTokens = (
          await Promise.all(tokenPromisesResponse.map((token) => token.json()))
        ).map((tokenObj) => tokenObj.token)

        return setRoomTokens(hostTokens)
      }

      setupTokens()
    }
  }, [userId, role, myRoomNumber, numRooms])

  // get online event users
  // set room number
  // set number of rooms
  // get users a token
  // get hosts a bunch of tokens
  // set tokens
  // connect to rooms accordingly

  useEffect(() => {
    if (roomTokens.length) {
      const isEventHost = event.host_id === userId
      const setupRoom = async () => {
        const localStoragePreferredVideoId = localStorage.getItem('preferredVideoId')
        const localStoragePreferredAudioId = localStorage.getItem('preferredAudioId')

        // if theres only 1 room, or if you're a non-host:  do this
        if (roomTokens.length === 1) {
          const myRoom = await connect(roomTokens[0], {
            maxAudioBitrate: 16000,
            video: isEventHost ? { deviceId: localStoragePreferredVideoId } : false,
            audio:
              isEventHost && process.env.NODE_ENV === 'production'
                ? { deviceId: localStoragePreferredAudioId }
                : false,
          })
          return startPreEventTwilio(myRoom, isEventHost)
        }

        // if we get here, we have an array of tokens (hosts only)
        // multiple rooms to connect to
        const roomCreationPromises = []
        roomTokens.forEach((token) => {
          roomCreationPromises.push(
            connect(token, {
              preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
              maxAudioBitrate: 16000,
              video: isEventHost ? { deviceId: localStoragePreferredVideoId } : false,
              audio:
                isEventHost && process.env.NODE_ENV === 'production'
                  ? { deviceId: localStoragePreferredAudioId }
                  : false,
            })
          )
        })
        // Ask Mike: should we await here?
        console.log('setupRoom -> roomCreationPromises.length', roomCreationPromises.length)
        Promise.all(roomCreationPromises).then((res) => {
          res.forEach((room) => startPreEventTwilio(room, isEventHost))
        })
      }
      setupRoom()
    }
  }, [roomTokens])

  return (
    <Grid className={classes.preEventWrapper} container direction="column" justify="center">
      {micOrCameraIsDisabled && (
        <CameraDisabledBanner
          permissions={permissions}
          setCameraAndMicPermissions={setCameraAndMicPermissions}
        />
      )}
      <div id="host-video" className={classes.hostVid} />
    </Grid>
  )
}

export default PreEvent
