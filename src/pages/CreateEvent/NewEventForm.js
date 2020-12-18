import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import FormLabel from '@material-ui/core/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Radio from '@material-ui/core/Radio'
import Typography from '@material-ui/core/Typography'
import DateFnsUtils from '@date-io/date-fns'
import { Formik, Form, Field } from 'formik'
import { TextField, RadioGroup } from 'formik-material-ui'
import { TimePicker, DatePicker } from 'formik-material-ui-pickers'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { useHistory } from 'react-router-dom'
import { useMutation } from 'react-apollo'
import { Snack } from '../../common'
import { useUserContext } from '../../context'
import { sleep } from '../../helpers'
import { createEvent, insertEventUser } from '../../gql/mutations'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  formContainer: {
    width: '85%',
    height: 'auto',
    maxWidth: '1560px',
    margin: theme.spacing(0, 'auto', 0, 'auto'),
  },
  formInputMargin: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(0, 1),
  },
  pinkText: {
    color: theme.palette.common.basePink,
  },
  publicEventLabel: {
    fontSize: '0.75rem',
  },
  sectionContainer: {
    margin: theme.spacing(4, 0),
  },
}))

const NewEventForm = () => {
  const classes = useStyles()
  const history = useHistory()
  const { user } = useUserContext()
  const { id: user_id, role } = user
  const [showCreateEventSuccess, setShowCreateEventSuccess] = useState(false)
  const [createEventMutation] = useMutation(createEvent)
  const [insertEventUserMutation] = useMutation(insertEventUser)

  const getEventStartAt = (eventDate, eventTime) => {
    const dateISOString = eventDate.toISOString()
    const timeISOString = eventTime.toISOString()
    const indexOfTinEventDate = dateISOString.indexOf('T')
    const indexOfTinEventTime = timeISOString.indexOf('T')
    const slicedDate = dateISOString.slice(0, indexOfTinEventDate)
    const slicedTime = timeISOString.slice(indexOfTinEventTime)
    const formattedDate = slicedDate + slicedTime
    return formattedDate
  }

  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Typography variant="h2" style={{ fontWeight: 700, marginBottom: '10px' }}>
        Host An Event
      </Typography>
      <Typography variant="h4">Tell us a little about your event</Typography>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Formik
          initialValues={{
            event_name: 'My Awesome Event 🎉',
            event_date: new Date(),
            event_time: new Date(),
            description:
              "Welcome to Hi Right Now 🎉 ! We'll go through a series of 6 min, 1 on 1 chats to expand your network with growth-minded and entrepreneurial professionals. This could be professional or casual or anything in between! Keep it fun and let's meet some new people. 💃",
            public_event: 'private',
            round_length: 6,
            num_rounds: 9,
          }}
          onSubmit={async (values, { setSubmitting }) => {
            const {
              description,
              event_name,
              event_date,
              event_time,
              num_rounds,
              public_event,
              round_length,
            } = values
            let createEventResponse
            const start_at = getEventStartAt(event_date, event_time)
            const isPublicEvent = public_event === 'public'
            console.log('formattedDate ->', start_at)
            try {
              createEventResponse = await createEventMutation({
                variables: {
                  description,
                  event_name,
                  host_id: user_id,
                  num_rounds,
                  public_event: isPublicEvent,
                  round_length,
                  start_at,
                },
              })
              window.analytics.track('Event created', {
                num_rounds,
                round_length,
                public_event,
              })
            } catch (error) {
              console.log('error')
            }
            const { id: event_id } = createEventResponse.data.insert_events.returning[0]
            try {
              await insertEventUserMutation({
                variables: {
                  event_id,
                  user_id,
                },
              })
            } catch (error) {
              console.log('error = ', error)
            }

            setShowCreateEventSuccess(true)
            await sleep(800)
            setSubmitting(false)
            history.push(`/events/${event_id}`)
          }}
        >
          {({ submitForm, isSubmitting, values }) => (
            <Form className={classes.formContainer}>
              <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
                className={classes.sectionContainer}
              >
                <Typography variant="h3">Basics</Typography>
                <Grid container direction="row">
                  <Grid container className={classes.formInputMargin}>
                    <Field
                      component={TextField}
                      name="event_name"
                      label="Event Name"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6} className={classes.formInputMargin}>
                    <Field
                      component={DatePicker}
                      name="event_date"
                      label="Event Date"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6} className={classes.formInputMargin}>
                    <Field
                      component={TimePicker}
                      name="event_time"
                      label="Event Time"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid container className={classes.formInputMargin}>
                    <Field
                      component={TextField}
                      multiline
                      name="description"
                      label="Event Description"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid container direction="column" className={classes.formInputMargin}>
                    <FormLabel className={classes.publicEventLabel}>
                      Is this a public (any user can join) or private event?{' '}
                      <span className={classes.pinkText}>*</span>
                    </FormLabel>
                    <Field component={RadioGroup} name="public_event" fullWidth required>
                      <Grid container direction="row" className={classes.formInputMargin}>
                        <FormControlLabel
                          value="private"
                          control={<Radio disabled={isSubmitting} />}
                          label="Private"
                          disabled={isSubmitting}
                        />
                        <FormControlLabel
                          value="public"
                          control={<Radio disabled={isSubmitting} />}
                          label="Public"
                          disabled={isSubmitting}
                        />
                      </Grid>
                    </Field>
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="column"
                  justify="flex-start"
                  alignItems="flex-start"
                  className={classes.sectionContainer}
                >
                  <Typography variant="h3">Duration</Typography>
                  <Typography variant="body1" className={classes.pinkText}>
                    Your event will take around {values.round_length * values.num_rounds} minutes
                  </Typography>
                  <Grid container direction="row">
                    <Grid
                      container
                      item
                      direction="row"
                      alignItems="flex-end"
                      xs={12}
                      md={3}
                      className={classes.formInputMargin}
                    >
                      <Field
                        component={TextField}
                        name="round_length"
                        label="Round Length (minutes)"
                        type="number"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={3} className={classes.formInputMargin}>
                      <Field
                        component={TextField}
                        name="num_rounds"
                        label="Number Of Rounds"
                        type="number"
                        required
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
                className={classes.sectionContainer}
              >
                <Typography variant="h3">Post Event</Typography>
                <Grid container direction="row">
                  <Grid item xs={12} md={6} className={classes.formInputMargin}>
                  </Grid>
                </Grid>
              </Grid> */}
              <Grid container justify="center" alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={submitForm}
                >
                  Submit
                </Button>
              </Grid>
            </Form>
          )}
        </Formik>
        <Snack
          open={showCreateEventSuccess}
          onClose={() => setShowCreateEventSuccess(false)}
          severity="success"
          snackMessage="Event Created/Updated"
        />
      </MuiPickersUtilsProvider>
    </Grid>
  )
}

export default NewEventForm
