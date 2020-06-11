import React, { useState, useEffect } from 'react'

import DateFnsUtils from '@date-io/date-fns'
import { TextField, Button, Grid, Typography } from '@material-ui/core'
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers'
import { useMutation } from 'react-apollo'
import { makeStyles } from '@material-ui/styles'
import { useHistory, Redirect } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'
import { FloatCardMedium } from '.'

import { createEvent, updateEvent, insertEventUser } from '../gql/mutations'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: '100px',
  },
  formContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: '40px',
    paddingBottom: '40px',
    width: '40vw',
  },
  inputContainer: {
    marginTop: '2em',
    marginBottom: '2em',
  },
  input: {
    marginBottom: '1em',
  },
  dateTime: {
    width: '100%',
  },
  eventUpdated: {
    width: '100%',
    margin: '0 auto',
    fontSize: 18,
    textAlign: 'center',
    color: 'green',
  },
}))

const EventForm = ({ eventData }) => {
  const classes = useStyles()
  const { userId, role } = useAppContext()
  const history = useHistory()
  const [title, setTitle] = useState('My Awesome Event 🔥')
  const [description, setDescription] = useState("Let's get people hyped!")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString())
  const [eventUpdated, setEventUpdated] = useState(null)
  const [createEventMutation] = useMutation(createEvent, {
    variables: {
      description,
      event_name: title,
      start_at: selectedDate,
      host_id: userId,
    },
  })

  const [insertEventUserMutation, { data }] = useMutation(insertEventUser)

  const [updateEventMutation] = useMutation(updateEvent, {
    variables: {
      description,
      event_name: title,
      start_at: selectedDate,
      id: eventData.id,
    },
  })

  useEffect(() => {
    if (eventData) {
      const { description: eventDescription, event_name, start_at } = eventData
      setDescription(eventDescription)
      setTitle(event_name)
      setSelectedDate(start_at)
    }
  }, [eventData])

  // REDIRECTS
  if (userId && role !== 'host') {
    return <Redirect to="/events" />
  }

  if (!userId) {
    return <Redirect to="/" />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (eventData) {
      await updateEventMutation()
      setEventUpdated(true)
      setTimeout(() => {
        setEventUpdated(false)
      }, 5000)
    } else {
      const res = await createEventMutation()
      const { id } = res.data.insert_events.returning[0]
      await insertEventUserMutation({
        variables: {
          eventId: id,
          userId,
        },
      })
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
          <Grid item container direction="column" className={classes.formContainer}>
            <form onSubmit={handleSubmit}>
              <Grid item container direction="column" alignItems="center">
                <Grid item>
                  <Typography variant="h4" style={{ lineHeight: 1 }}>
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
                    minutesStep={15}
                    className={classes.dateTime}
                  />
                </Grid>
              </Grid>
              <Grid container justify="center" alignItems="center">
                <Button color="primary" type="submit" variant="contained">
                  {eventData ? 'Update Event' : 'Create Event'}
                </Button>
              </Grid>
            </form>
            {eventUpdated && <div className={classes.eventUpdated}>Event updated</div>}
          </Grid>
        </MuiPickersUtilsProvider>
      </FloatCardMedium>
    </div>
  )
}

export default EventForm
