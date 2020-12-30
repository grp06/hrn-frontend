import React, { useState, useEffect, useRef } from 'react'

import DateFnsUtils from '@date-io/date-fns'
import { TextField, Button, Grid, Typography, Switch, FormLabel } from '@material-ui/core'
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers'
import { useMutation } from 'react-apollo'
import { makeStyles } from '@material-ui/styles'
import { useHistory, Redirect } from 'react-router-dom'
import { useUserContext } from '../context'
import { FloatCardMedium, Snack } from '.'
import { sleep } from '../helpers'

import { createEvent, updateEvent, insertEventUser } from '../gql/mutations'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: '100px',
  },
  formContainer: {
    margin: theme.spacing(0, 'auto'),
    padding: theme.spacing(5),
  },
  inputContainer: {
    margin: theme.spacing(4, 0),
  },
  input: {
    marginBottom: theme.spacing(2),
  },
  dateTime: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  publicEventLabel: {
    color: theme.palette.common.basePink,
    fontSize: '0.75rem',
    fontWeight: '300',
    letterSpacing: '0.00938em',
    marginBottom: theme.spacing(1.5),
    marginRight: 'auto',
  },
  eventUpdated: {
    width: '100%',
    margin: theme.spacing(0, 'auto'),
    textAlign: 'center',
    color: 'green',
  },
}))

const EventForm = ({ eventData, match }) => {
  const classes = useStyles()

  const { user } = useUserContext()
  const { id: user_id, role } = user
  const history = useHistory()
  const [title, setTitle] = useState('My Awesome Event 🔥')
  const [description, setDescription] = useState(
    "Welcome to Hi Right Now 🎉 ! We'll go through a series of 6 min, 1 on 1 chats to expand your network with growth-minded and entrepreneurial professionals. This could be professional or casual or anything in between! Keep it fun and let's meet some new people. 💃"
  )
  const [isEventPublic, setIsEventPublic] = useState(false)
  const [roundLength, setRoundLength] = useState(5)
  const [numRounds, setNumRounds] = useState(10)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString())
  const [showCreateEditEventSuccess, setShowCreateEditEventSuccess] = useState(false)

  const initialEventData = useRef()
  const [createEventMutation] = useMutation(createEvent, {
    variables: {
      description,
      event_name: title,
      start_at: selectedDate,
      host_id: user_id,
      public_event: isEventPublic,
      round_length: roundLength,
      num_rounds: numRounds,
    },
  })

  const [insertEventUserMutation] = useMutation(insertEventUser)
  const [updateEventMutation] = useMutation(updateEvent)

  useEffect(() => {
    if (eventData && !initialEventData.current) {
      initialEventData.current = eventData
      const {
        description: eventDescription,
        event_name,
        start_at,
        round_length,
        num_rounds,
        post_event_link,
        public_event,
      } = eventData
      setDescription(eventDescription)
      setTitle(event_name)
      setSelectedDate(start_at)
      setRoundLength(round_length)
      setNumRounds(num_rounds)
      setIsEventPublic(public_event)
    }
  }, [eventData])

  // REDIRECTS
  if (!user_id) {
    return <Redirect to="/" />
  }

  if (user_id && !role.includes('host')) {
    return <Redirect to="/events" />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (eventData) {
      try {
        await updateEventMutation({
          variables: {
            description,
            event_name: title,
            start_at: selectedDate,
            id: eventData.id,
            round_length: roundLength,
            num_rounds: numRounds,
            public_event: isEventPublic,
          },
        })
        window.analytics.track('Event updated', {
          numRounds,
          roundLength,
          isEventPublic,
        })
      } catch (error) {
        console.log('error = ', error)
      }
      setShowCreateEditEventSuccess(true)
    } else {
      let createEventResponse
      try {
        createEventResponse = await createEventMutation()
        window.analytics.track('Event created', {
          numRounds,
          roundLength,
          isEventPublic,
        })
      } catch (error) {
        console.log('error')
      }

      const { id } = createEventResponse.data.insert_events.returning[0]
      try {
        await insertEventUserMutation({
          variables: {
            event_id: id,
            user_id,
          },
        })
      } catch (error) {
        console.log('error = ', error)
      }

      setShowCreateEditEventSuccess(true)
      await sleep(800)
      history.push(`/events/${id}`)
    }
  }

  const getRowNumber = () => {
    const charsPerLine = 65
    const numRows = Math.ceil(description.length / charsPerLine)
    return numRows === 0 ? 1 : numRows
  }

  return (
    <div className={classes.wrapper}>
      <FloatCardMedium>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item container direction="column" md={9} xs={12} className={classes.formContainer}>
            <form onSubmit={handleSubmit}>
              <Grid item container direction="column" alignItems="center">
                <Grid item>
                  <Typography variant="h2">
                    {eventData ? 'Edit ' : 'Create '}
                    Your Event
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container direction="column" className={classes.inputContainer}>
                <Grid item>
                  <TextField
                    id="title"
                    label="Title"
                    required
                    fullWidth
                    className={classes.input}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    id="desc"
                    label="Description"
                    required
                    fullWidth
                    multiline
                    rows={getRowNumber()}
                    className={classes.input}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <DateTimePicker
                    variant="inline"
                    label="Date and time"
                    value={selectedDate}
                    onChange={setSelectedDate}
                    minutesStep={1}
                    className={classes.dateTime}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    id="round-length"
                    label="Round Length (in minutes)"
                    required
                    fullWidth
                    type="number"
                    className={classes.input}
                    value={roundLength}
                    onChange={(e) => setRoundLength(e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    id="num-rounds"
                    label="Number of total rounds in event"
                    required
                    fullWidth
                    type="number"
                    className={classes.input}
                    value={numRounds}
                    onChange={(e) => setNumRounds(e.target.value)}
                  />
                </Grid>
                <Grid
                  container
                  direction="column"
                  justify="flex-start"
                  style={{ marginBottom: '8px' }}
                >
                  <FormLabel className={classes.publicEventLabel}>
                    Public Event (any user can join)
                  </FormLabel>
                  <Switch
                    checked={isEventPublic}
                    onChange={(e) => {
                      console.log(e.target.checked)
                      setIsEventPublic(e.target.checked)
                    }}
                    color="secondary"
                    name="public_event"
                    label="public event"
                    size="small"
                  />
                </Grid>
              </Grid>
              <Grid container justify="center" alignItems="center">
                <Button color="primary" type="submit" variant="contained">
                  {eventData ? 'Update Event' : 'Create Event'}
                </Button>
              </Grid>
            </form>
            <Snack
              open={showCreateEditEventSuccess}
              onClose={() => setShowCreateEditEventSuccess(false)}
              severity="success"
              snackMessage="Event Created/Updated"
            />
          </Grid>
        </MuiPickersUtilsProvider>
      </FloatCardMedium>
    </div>
  )
}

export default EventForm
