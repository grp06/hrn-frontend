import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import DateFnsUtils from '@date-io/date-fns'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { TimePicker, DatePicker } from 'formik-material-ui-pickers'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { useHistory } from 'react-router-dom'
import { useMutation } from 'react-apollo'
import { Snack } from '../../common'
import { useUserNewContext } from '../../context'
import { sleep } from '../../helpers'
import { createEventNew } from '../../gql/mutations'
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

const CreateEventNew = () => {
  const classes = useStyles()
  const history = useHistory()
  const { userNew } = useUserNewContext()
  const { id: user_id, role } = userNew
  const [showCreateEventSuccess, setShowCreateEventSuccess] = useState(false)
  const [createEventNewMutation] = useMutation(createEventNew)

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
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      style={{ marginTop: '75px' }}
    >
      <Typography variant="h2" style={{ fontWeight: 700, marginBottom: '10px' }}>
        Let Your Fans Meet You
      </Typography>
      <Typography variant="h4">Tell us a little about your event</Typography>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Formik
          initialValues={{
            event_date: new Date(),
            event_time: new Date(),
            round_length: 2,
            num_rounds: 15,
          }}
          onSubmit={async (values, { setSubmitting }) => {
            const { event_date, event_time, num_rounds, round_length } = values
            let createEventResponse
            const start_at = getEventStartAt(event_date, event_time)
            try {
              createEventResponse = await createEventNewMutation({
                variables: {
                  host_id: user_id,
                  num_rounds,
                  round_length,
                  start_at,
                },
              })
              window.analytics.track('Event New created', {
                num_rounds,
                round_length,
              })
            } catch (error) {
              console.log('error')
            }
            const { id: event_id } = createEventResponse.data.insert_events_new.returning[0]
            setShowCreateEventSuccess(true)
            await sleep(800)
            setSubmitting(false)
            history.push(`/events-new/${event_id}`)
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

export default CreateEventNew
