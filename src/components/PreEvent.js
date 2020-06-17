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
        const res = await getToken(`pre-event-${eventId}`, userId).then((response) =>
          response.json()
        )
        setToken(res.token)
      }
      setupToken()
    }
  }, [userId, role])

  useEffect(() => {
    if (token) {
      console.log('PreEvent -> role', role)
      const setupRoom = async () => {
        let localTracks
        if (role === 'host') {
          try {
            console.log('hi')

            localTracks = await createLocalTracks({
              video: true,
              audio: false,
            })
          } catch (err) {
            setGUMError(err.name)
            return setIsGUMErrorModalActive(true)
          }
        }

        const myRoom = await connect(token, {
          name: `pre-event-${eventId}`,
          tracks: role === 'host' ? localTracks : [],
        })

        startPreEventTwilio(myRoom)

        console.warn('setting room to ID = ', `pre-event-${eventId}`)
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
