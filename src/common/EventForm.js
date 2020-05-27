import React, { useState } from 'react'

import DateFnsUtils from '@date-io/date-fns'
import { TextField, Button, Grid, Typography } from '@material-ui/core'
import {
  MuiPickersUtilsProvider,
  DateTimePicker,
  KeyboardDateTimePicker,
} from '@material-ui/pickers'
import { useMutation } from 'react-apollo'
import { makeStyles } from '@material-ui/styles'
import { Redirect, useHistory } from 'react-router-dom'
import { useGameContext } from '../context/useGameContext'

import { createEvent } from '../gql/mutations'

const useStyles = makeStyles((theme) => ({
  formContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  subheading: {
    color: theme.palette.common.rebeccaPurple,
    textAlign: 'center',
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
}))

const EventForm = () => {
  const classes = useStyles()
  const { userId } = useGameContext()
  const history = useHistory()

  const [title, setTitle] = useState('My event title')
  const [description, setDescription] = useState('My description')
  const [selectedDate, handleDateChange] = useState(new Date().toISOString())
  const [createEventMutation] = useMutation(createEvent, {
    variables: {
      description,
      event_name: title,
      start_at: selectedDate,
      host_id: userId,
    },
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    const res = await createEventMutation()
    console.log('res = ', res)
    const { id } = res.data.insert_events.returning[0]
    history.push(`/events/${id}`)
  }

  const getRowNumber = () => {
    const charsPerLine = 65
    const numRows = Math.ceil(description.length / charsPerLine)
    return numRows === 0 ? 1 : numRows
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid item container direction="column" md={6} sm={10} className={classes.formContainer}>
        <form onSubmit={handleSubmit}>
          <Grid item container direction="column" alignItems="center">
            <Grid item>
              <Typography variant="h4" style={{ lineHeight: 1 }}>
                Create Your Event
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
                onChange={handleDateChange}
                minutesStep={15}
                className={classes.dateTime}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Button primary="true" type="submit" variant="outlined">
              Submit
            </Button>
          </Grid>
        </form>
      </Grid>
    </MuiPickersUtilsProvider>
  )
}

export default EventForm
