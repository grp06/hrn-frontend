import React, { useState } from 'react'

import DateFnsUtils from '@date-io/date-fns'
import { TextField, Button, Grid, Typography } from '@material-ui/core'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import { makeStyles } from '@material-ui/styles'

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
}))

const EventForm = () => {
  const classes = useStyles()

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [date, setDate] = useState(Date.now())
  const [eventTime, setEventTime] = useState(new Date())

  const handleFormSubmit = (event) => {
    setTitle('')
    setDesc('')
    setDate(Date.now())
    setEventTime(new Date())
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container direction="column" md={4} sm={8} className={classes.formContainer}>
        <form onSubmit={handleFormSubmit}>
          <Grid item container direction="column" alignItems="center">
            <Grid item>
              <Typography variant="h4" style={{ lineHeight: 1 }}>
                Create Your Event
              </Typography>
              <Typography variant="body1" className={classes.subheading}>
                Some subheading
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
                rows={3}
                className={classes.input}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </Grid>
            <Grid item>
              <KeyboardDatePicker
                margin="normal"
                id="date"
                label="Event Date"
                format="MM/dd/yyyy"
                fullWidth
                value={date}
                onChange={(selectedDate) => setDate(selectedDate)}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Grid>
            <Grid item>
              <KeyboardTimePicker
                margin="normal"
                id="time"
                label="Event Time"
                fullWidth
                placeholder="08:00 AM"
                mask="__:__ _M"
                value={eventTime}
                onChange={(selectedTime) => setEventTime(selectedTime)}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Button primary type="submit" variant="outlined">
              Submit
            </Button>
          </Grid>
        </form>
      </Grid>
    </MuiPickersUtilsProvider>
  )
}

export default EventForm
