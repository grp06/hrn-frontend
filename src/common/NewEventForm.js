import React from 'react'

import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { DateTimePicker } from 'formik-material-ui-pickers'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'

const NewEventForm = () => {
  return (
    <Formik
      initialValues={{
        eventName: 'My Awesome Event 🎉',
        eventDate: new Date().toLocaleDateString(),
        // eventDate: new Date().toISOString(),
        eventTime: new Date().toLocaleTimeString(),
        eventDescription:
          "Welcome to Hi Right Now 🎉 ! We'll go through a series of 6 min, 1 on 1 chats to expand your network with growth-minded and entrepreneurial professionals. This could be professional or casual or anything in between! Keep it fun and let's meet some new people. 💃",
        publicEvent: false,
        roundLength: 5,
        numRounds: 10,
      }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false)
        alert(JSON.stringify(values, null, 2))
      }}
    >
      {({ submitForm, isSubmitting }) => (
        <Form>
          <Grid container direction="column" justify="flex-start" alignItems="flex-start">
            <Typography variant="h2">Basics</Typography>
            <Grid container direction="row">
              <Grid item xs={12} lg={6}>
                <Field component={TextField} name="eventName" label="Event Name" fullWidth />
              </Grid>
              <Grid item xs={12} lg={6}>
                <Field
                  component={TextField}
                  name="eventDescription"
                  label="Event Description"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
          {isSubmitting ? <LinearProgress /> : null}
          <Button variant="contained" color="primary" disabled={isSubmitting} onClick={submitForm}>
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default NewEventForm
