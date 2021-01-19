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
import { useUserContext } from '../../context'
import { sleep } from '../../helpers'
import { createChitChat } from '../../gql/mutations'
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
  sectionContainer: {
    margin: theme.spacing(4, 0),
  },
}))

const CreateChitChat = () => {
  const classes = useStyles()
  const history = useHistory()
  const { user } = useUserContext()
  const { id: user_id, role } = user
  const [showCreateChitChatSuccess, setShowCreateChitChatSuccess] = useState(false)
  const [createChitChatMutation] = useMutation(createChitChat)

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
        Create Event
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
            let createChitChatResponse
            const start_at = getEventStartAt(event_date, event_time)
            try {
              createChitChatResponse = await createChitChatMutation({
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
            const { id: event_id } = createChitChatResponse.data.insert_events_new.returning[0]
            setShowCreateChitChatSuccess(true)
            await sleep(800)
            setSubmitting(false)
            history.push(`/chit-chat/${event_id}`)
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
                <Typography variant="h3">Event Details</Typography>
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
                  direction="row"
                  justify="flex-start"
                  alignItems="flex-start"
                  className={classes.sectionContainer}
                >
                  <Typography variant="h3">Duration</Typography>

                  <Grid container direction="row">
                    <Field
                      component={TextField}
                      name="round_length"
                      label="Length of each conversation (minutes)"
                      type="number"
                      required
                      className={classes.conversationLength}
                    />
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
          open={showCreateChitChatSuccess}
          onClose={() => setShowCreateChitChatSuccess(false)}
          severity="success"
          snackMessage="Event Created/Updated"
        />
      </MuiPickersUtilsProvider>
    </Grid>
  )
}

export default CreateChitChat
