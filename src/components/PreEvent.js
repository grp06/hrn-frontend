import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { useAppContext } from '../context/useAppContext'
import { getToken } from '../helpers'
import { GUMErrorModal } from '../common'
import { usePreEventTwilio } from '../hooks'
import { getOnlineUsersByEventId } from '../gql/queries'
import { constants } from '../utils'

const { maxNumRoomUsers } = constants

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
}))

const PreEvent = ({ match }) => {
  const { id: eventId } = match.params
  const classes = useStyles()
  const history = useHistory()
  const { user, event } = useAppContext()
  const { userId, role } = user
  const [isGUMErrorModalActive, setIsGUMErrorModalActive] = useState(false)
  const [GUMError, setGUMError] = useState('')
  const [roomTokens, setRoomTokens] = useState([])
  const [myRoomNumber, setMyRoomNumber] = useState(null)
  const [numRooms, setNumRooms] = useState(null)
  const { startPreEventTwilio } = usePreEventTwilio()
  const eventSet = Object.keys(event).length > 1

  const { data: onlineUsersData, loading: onlineUsersLoading } = useQuery(getOnlineUsersByEventId, {
    variables: {
      event_id: eventId,
    },
    skip: !eventId,
  })

  useEffect(() => {
    if (eventSet) {
      const { status } = event

      if (status !== 'pre-event') {
        return history.push(`/events/${eventId}`)
      }
    }
  }, [event])

  useEffect(() => {
    if (eventSet && onlineUsersData && userId) {
      const onlineUsers = onlineUsersData.event_users.map((userObject) => userObject.user.id)
      const numOnlineUsers = onlineUsers.length
      console.log('numOnlineUsers ->', numOnlineUsers)
      console.log('onlineUsers ->', onlineUsers)

      if (numOnlineUsers < maxNumRoomUsers) {
        setMyRoomNumber(1)
        return setNumRooms(1)
      }
      // get online users, divide by 50 and round up = number of rooms
      const numberOfRooms = Math.ceil(numOnlineUsers / maxNumRoomUsers)
      console.log('numberOfRooms ->', numberOfRooms)
      const usersPerRoom = Math.ceil(numOnlineUsers / numberOfRooms)
      console.log('usersPerRoom ->', usersPerRoom)
      const currentUserIndex = onlineUsers.indexOf(userId)
      console.log('currentUserIndex ->', currentUserIndex)
      const room = currentUserIndex === 0 ? 1 : Math.floor(currentUserIndex / usersPerRoom) + 1
      console.log('room ->', room)
      setMyRoomNumber(room)
      setNumRooms(numberOfRooms)
    }
  }, [event, onlineUsersData, userId])

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
        console.log(hostTokens)
        return setRoomTokens(hostTokens)
      }

      setupTokens()
    }
  }, [userId, role, myRoomNumber, numRooms])

  useEffect(() => {
    if (roomTokens.length) {
      const isEventHost = event.host_id === userId
      const setupRoom = async () => {
        let localTracks

        if (isEventHost) {
          try {
            localTracks = await createLocalTracks({
              video: true,
              audio: process.env.NODE_ENV === 'production',
            })
          } catch (err) {
            setGUMError(err.name)
            return setIsGUMErrorModalActive(true)
          }
        }
        console.log(myRoomNumber)
        // if theres only 1 room, or if you're a user - do this
        if (roomTokens.length === 1) {
          const myRoom = await connect(roomTokens[0], {
            tracks: isEventHost ? localTracks : [],
          })
          return startPreEventTwilio(myRoom, isEventHost)
        }

        const roomCreationPromises = []
        roomTokens.map((token) => {
          roomCreationPromises.push(
            connect(token, {
              tracks: localTracks,
            })
          )
        })

        Promise.all(roomCreationPromises).then((res) => {
          startPreEventTwilio(res.room, isEventHost)
        })
      }
      setupRoom()
    }
  }, [roomTokens])

  return (
    <div className={classes.videoWrapper}>
      <div id="host-video" className={classes.hostVid} />
    </div>
  )
}

export default PreEvent
