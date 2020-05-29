import React, { useEffect, useRef } from 'react'
import { useMutation } from '@apollo/react-hooks'

import { makeStyles } from '@material-ui/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { useHistory } from 'react-router-dom'
import { useGetRoomId } from '../hooks'
import { useGameContext } from '../context/useGameContext'
import { FloatCardWide, AttendeesList } from '.'
import { insertEventUser, deleteEventUser } from '../gql/mutations'

const useStyles = makeStyles((theme) => ({
  topDashboard: {
    width: '100%',
    paddingTop: '40px',
    paddingBottom: '40px',
    borderStyle: 'none none solid',
    borderWidth: '1px',
    borderColor: theme.palette.common.independence,
    borderRadius: '4px 4px 0px 0px',
    backgroundColor: theme.palette.common.ghostWhite,
  },
  categoryHeader: {
    ...theme.typography.h2,
    color: theme.palette.common.independence,
  },
  displayNumber: {
    fontFamily: 'Muli',
    color: theme.palette.common.orchid,
    fontSize: '4.5rem',
  },
  partyEmoji: {
    marginLeft: 10,
  },
}))

const UserPanel = ({ timeState, eventData, refetch }) => {
  const classes = useStyles()
  const { roomId, room, userId, role, currentRound } = useGameContext()
  const { setToken } = useGetRoomId()
  const mounted = useRef()
  const history = useHistory()

  const [insertEventUserMutation] = useMutation(insertEventUser, {
    variables: {
      eventId: eventData.events[0].id,
      userId,
    },
    skip: role === 'host',
  })
  const [deleteEventUserMutation] = useMutation(deleteEventUser, {
    variables: {
      eventId: eventData.events[0].id,
      userId,
    },
    skip: role === 'host',
  })
  useEffect(() => {
    if (!mounted.current && roomId) {
      mounted.current = roomId
      setToken()
    } else if (roomId !== mounted.current) {
      mounted.current = roomId
      setToken()
    }
  }, [roomId, room])

  const attendees = eventData.events[0].event_users
  const alreadyAttending = attendees.find((attendee) => attendee.user.id === userId)

  const renderButton = () => {
    let element
    switch (timeState) {
      case 'future':
        element = (
          <Button
            variant="contained"
            onClick={async () => {
              if (alreadyAttending) {
                await deleteEventUserMutation()
                refetch()
              } else {
                await insertEventUserMutation()
                refetch()
              }
            }}
          >
            {alreadyAttending ? 'Cancel RSVP' : 'Join Event'}
          </Button>
        )
        break
      case 'go time':
        element = null
        break
      default:
        element = <div>coutndown and rsvp?</div>
    }
    return element
  }

  if (currentRound === 1) {
    history.push('/video-room')
  }

  return (
    <FloatCardWide>
      <Grid
        item
        container
        justify="space-around"
        alignItems="center"
        // wrap="nowrap"
        className={classes.topDashboard}
      >
        <Grid container item md={6} xs={12} direction="column" justify="center" alignItems="center">
          <Typography className={classes.categoryHeader}>Participants Signed Up</Typography>
          <Typography className={classes.displayNumber}>{attendees.length}</Typography>
        </Grid>
        <Grid container item md={6} xs={12} direction="column" justify="center" alignItems="center">
          {renderButton()}
        </Grid>
      </Grid>
      <AttendeesList attendees={attendees} />
    </FloatCardWide>
  )
}
export default UserPanel
