import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'
import { getToken } from '../helpers'
import { GUMErrorModal } from '../common'
import { usePreEventTwilio } from '../hooks'

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
  const [token, setToken] = useState('')
  const { startPreEventTwilio } = usePreEventTwilio()
  const eventSet = Object.keys(event).length > 1

  useEffect(() => {
    if (eventSet) {
      const { status } = event

      if (status !== 'pre-event') {
        return history.push(`/events/${eventId}`)
      }
    }
  }, [event])

  useEffect(() => {
    // can we make it so we don't need this check? like - not render without a userId?
    if (userId) {
      const setupToken = async () => {
        const res = await getToken(`${eventId}-pre-event`, userId).then((response) =>
          response.json()
        )

        setToken(res.token)
      }
      setupToken()
    }
  }, [userId, role])

  useEffect(() => {
    if (token) {
      const isEventHost = event.host_id === userId
      console.log('PreEvent -> userId', userId)
      console.log('PreEvent ->  event.host_id', event.host_id)
      const setupRoom = async () => {
        let localTracks
        console.log('PreEvent -> isEventHost', isEventHost)
        if (isEventHost) {
          try {
            localTracks = await createLocalTracks({
              video: true,
              audio:
                process.env.NODE_ENV === 'production' &&
                window.location.pathname.indexOf('staging') === -1,
            })
          } catch (err) {
            setGUMError(err.name)
            return setIsGUMErrorModalActive(true)
          }
        }

        const myRoom = await connect(token, {
          tracks: isEventHost ? localTracks : [],
        })

        startPreEventTwilio(myRoom)
      }

      setupRoom()
    }
  }, [token])

  return (
    <div className={classes.videoWrapper}>
      <div id="host-video" className={classes.hostVid} />
    </div>
  )
}

export default PreEvent
