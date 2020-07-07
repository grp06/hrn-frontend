import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { useAppContext } from '../context/useAppContext'
import { getToken } from '../helpers'
import { GUMErrorModal } from '../common'
import { usePreEventTwilio } from '../hooks'
import { getOnlineUsersByEventId } from '../gql/queries'

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
  const [tokens, setTokens] = useState([])
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
  console.log('PreEvent -> onlineUsersData', onlineUsersData)

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
      const onlineUsers = onlineUsersData.event_users
      const numOnlineUsers = onlineUsers.length

      if (numOnlineUsers < 50) {
        setMyRoomNumber(1)
        return setNumRooms(1)
      }
      // get online users, divide by 50 and round up = number of rooms
      const numberOfRooms = Math.ceil(numOnlineUsers / 50)

      const usersPerRoom = Math.ceil(numOnlineUsers / numRooms)

      const currentUserIndex = onlineUsers.indexOf(userId)

      const room = Math.ceil(currentUserIndex / usersPerRoom - 1)

      setMyRoomNumber(room)
      setNumRooms(numberOfRooms)
    }
  }, [event, onlineUsersData, userId])

  useEffect(() => {
    // can we make it so we don't need this check? like - not render without a userId?
    if (userId) {
      const setupTokens = async () => {
        const isEventHost = event.host_id === userId
        if (!isEventHost) {
          const res = await getToken(
            `${eventId}-pre-event-${myRoomNumber}`,
            userId
          ).then((response) => response.json())
          return setTokens([res.token])
        }

        const hostTokens = []
        const tokenPromises = []

        // eslint-disable-next-line no-restricted-syntax
        for (let i = 0; i <= numRooms; i++) {
          tokenPromises.push(getToken(`${eventId}-pre-event-${i + 1}`, userId))
        }
        const tokenPromisesResponse = await Promise.all(tokenPromises)
        tokenPromisesResponse.forEach(async (token) => {
          console.log('setupTokens -> token', token)
          const tokenResponse = await token.json()
          console.log('setupTokens -> tokenResponse', tokenResponse)
          hostTokens.push(tokenResponse.token)
        })
        console.log('setupTokens -> hostTokens', hostTokens)

        return setTokens(hostTokens)
      }
      setupTokens()
    }
  }, [userId, role, myRoomNumber, numRooms])

  useEffect(() => {
    if (tokens.length) {
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
        // if theres only 1 room, or if you're a user - do this
        if (tokens.length === 1) {
          const myRoom = await connect(tokens[0], {
            tracks: isEventHost ? localTracks : [],
          })
          return startPreEventTwilio(myRoom, isEventHost)
        }

        const promises = []
        tokens.map((token, idx) => {
          promises.push(
            connect(tokens[idx], {
              tracks: localTracks,
            })
          )
        })

        Promise.all(promises).then((res) => {
          startPreEventTwilio(res.room, isEventHost)
        })
      }

      setupRoom()
    }
  }, [tokens])

  return (
    <div className={classes.videoWrapper}>
      <div id="host-video" className={classes.hostVid} />
    </div>
  )
}

export default PreEvent
