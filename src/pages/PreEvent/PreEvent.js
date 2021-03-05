import React, { useState, useEffect } from 'react'
import { Grid, Typography } from '@material-ui/core'
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined'
import { useHistory } from 'react-router-dom'
import { AnimatedHostNameCard, usePreEventStyles } from '.'
import { useEventContext, useUserContext } from '../../context'
import { getToken } from '../../helpers'
import { usePreEventTwilio } from '../../hooks'
import { constants } from '../../utils'

const { maxNumUsersPerRoom } = constants

const { connect } = require('twilio-video')

const PreEvent = ({ onlineEventUsers }) => {
  // const { id: eventId } = match.params
  const classes = usePreEventStyles()
  const history = useHistory()
  const { user } = useUserContext()

  const { event } = useEventContext()
  const { id: userId, role } = user
  const { host, id: eventId } = event
  const { name: hostName } = host
  const [roomTokens, setRoomTokens] = useState([])
  const [myRoomNumber, setMyRoomNumber] = useState(null)
  const [numRooms, setNumRooms] = useState(null)
  const { startPreEventTwilio } = usePreEventTwilio()
  const hostsFirstName = hostName && hostName.split(' ')[0]
  const userIsHost = event.host_id === userId

  useEffect(() => {
    if (event) {
      if (event.status !== 'pre-event') {
        return history.push(`/events/${event.id}`)
      }
    }
  }, [event, history])

  useEffect(() => {
    if (onlineEventUsers && onlineEventUsers.length) {
      const numOnlineUsers = onlineEventUsers.length

      if (numOnlineUsers < maxNumUsersPerRoom) {
        setMyRoomNumber(1)
        return setNumRooms(1)
      }

      // only get down here with more than 50 online users
      // get online users, divide by 50 and round up = number of rooms
      const numberOfRooms = Math.ceil(numOnlineUsers / maxNumUsersPerRoom)
      const usersPerRoom = Math.ceil(numOnlineUsers / numberOfRooms)

      const userIdsArray = onlineEventUsers.map((u) => u.user[0].id).sort()
      const currentUserIndex = userIdsArray.indexOf(userId)
      const roomNumber = Math.floor(currentUserIndex / usersPerRoom) + 1

      setMyRoomNumber(roomNumber)
      setNumRooms(numberOfRooms)
    }
  }, [onlineEventUsers, userId])

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
  }, [eventId, event.host_id, userId, role, myRoomNumber, numRooms])

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
        const audioDevice =
          isEventHost && process.env.NODE_ENV === 'production'
            ? { deviceId: localStoragePreferredAudioId }
            : false

        // if theres only 1 room, or if you're a non-host:  do this
        if (roomTokens.length === 1) {
          const myRoom = await connect(roomTokens[0], {
            maxAudioBitrate: 16000,
            video: isEventHost ? { deviceId: localStoragePreferredVideoId } : false,
            audio: audioDevice,
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
        Promise.all(roomCreationPromises).then((res) => {
          res.forEach((room) => startPreEventTwilio(room, isEventHost))
        })
      }
      setupRoom()
    }
  }, [event.host_id, roomTokens, userId])

  return (
    <Grid className={classes.preEventWrapper} container direction="column" justify="center">
      <div id="host-video" className={classes.hostVid} />
      <Grid container direction="column" className={classes.liveAndViewersContainer}>
        <Typography className={classes.liveLogo} variant="subtitle1">
          LIVE
        </Typography>
        {userIsHost ? (
          <Grid container justify="center" alignItems="center" className={classes.viewersContainer}>
            <VisibilityOutlinedIcon stroke="#f4f6fa" style={{ color: '#f4f6fa' }} />
            <Typography variant="body1" className={classes.viewersNumber}>
              {onlineEventUsers && onlineEventUsers.length ? onlineEventUsers.length : '--'}
            </Typography>
          </Grid>
        ) : null}
      </Grid>
      <AnimatedHostNameCard hostsFirstName={hostsFirstName} />
    </Grid>
  )
}

export default PreEvent
