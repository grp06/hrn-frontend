import React, { useState } from 'react'

import DateFnsUtils from '@date-io/date-fns'
import { Formik, Form, Field } from 'formik'
import { TextField, RadioGroup } from 'formik-material-ui'
import { TimePicker, DatePicker } from 'formik-material-ui-pickers'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { useHistory } from 'react-router-dom'
import { useMutation } from 'react-apollo'
import { Button, FormLabel, FormControlLabel, Grid, Radio, Typography } from '@material-ui/core'
import { MatchingOptionCard, useCreateEventStyles } from '.'
import { Snack } from '../../common'
import { sleep } from '../../helpers'
import { upsertEvent, insertEventUser } from '../../gql/mutations'
import { constants } from '../../utils'
import clsx from 'clsx'

declare global {
  interface Window {
    analytics: any
  }
}

interface NewEventFormProps {
  eventDetails: object
  userId: number
}

const NewEventForm: React.FC<NewEventFormProps> = ({ eventDetails, userId }) => {
  const classes = useCreateEventStyles()
  const history = useHistory()
  const { matchingOptionCardObjects } = constants
  const [showCreateEventSuccess, setShowCreateEventSuccess] = useState<boolean>(false)
  const [insertEventUserMutation] = useMutation(insertEventUser)
  const [upsertEventMutation] = useMutation(upsertEvent, {
    onCompleted: async (data) => {
      const [upsertEventResponse] = data?.insert_events.returning
      const { host_id, id: event_id, num_rounds, public_event, round_length } = upsertEventResponse
      window.analytics.track('Event created', {
        num_rounds,
        round_length,
        public_event,
      })
      // if we are getting passed eventDetails then the user is editing the event
      // so dont re-insert them
      if (!Object.keys(eventDetails).length)
        try {
          await insertEventUserMutation({
            variables: {
              event_id,
              user_id: host_id,
            },
          })
        } catch (error) {
          console.log('error = ', error)
        }
      setShowCreateEventSuccess(true)
      await sleep(800)
      history.push(`/events/${event_id}`)
    },
  })

  const {
    event_name,
    description,
    id: eventId,
    matching_type,
    num_rounds,
    public_event,
    round_length,
    start_at,
  } = Object(eventDetails)

  const getEventStartAt = (eventDate: Date, eventTime: Date) => {
    const dateISOString = eventDate.toISOString()
    const timeISOString = eventTime.toISOString()
    const indexOfTinEventDate = dateISOString.indexOf('T')
    const indexOfTinEventTime = timeISOString.indexOf('T')
    const slicedDate = dateISOString.slice(0, indexOfTinEventDate)
    const slicedTime = timeISOString.slice(indexOfTinEventTime)
    const formattedDate = slicedDate + slicedTime
    return formattedDate
  }

  const renderMatchingOptionCards = (field: any, form: any) => {
    return matchingOptionCardObjects.map((matchingOption) => {
      const { allowedRoles, description, databaseValue, imageURL, name } = matchingOption
      return (
        <div
          key={databaseValue}
          className={clsx({
            [classes.selectedMatchingOption]: field.value === databaseValue,
            [classes.matchingOptionCardContainer]: true,
          })}
        >
          <MatchingOptionCard
            description={description}
            imageURL={imageURL}
            isSelected={field.value === databaseValue}
            onClick={(databaseValue) => form.setFieldValue('matching_type', databaseValue)}
            optionName={name}
            value={databaseValue}
          />
        </div>
      )
    })
  }

  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Typography variant="h2" style={{ fontWeight: 700, marginBottom: '10px' }}>
        {eventDetails ? 'Edit Your Event' : 'Host An Event'}
      </Typography>
      <Typography variant="h4">Tell us a little about your event</Typography>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Formik
          initialValues={{
            event_date: start_at ? new Date(start_at) : new Date(),
            event_name: event_name || 'My Awesome Event 🎉',
            event_time: start_at ? new Date(start_at) : new Date(),
            description:
              description ||
              "Welcome to Hi Right Now 🎉 ! We'll go through a series of 6 min, 1 on 1 chats to expand your network with growth-minded and entrepreneurial professionals. This could be professional or casual or anything in between! Keep it fun and let's meet some new people. 💃",
            matching_type: matching_type || 'relevant',
            num_rounds: num_rounds || 9,
            public_event: public_event ? 'public' : 'private',
            round_length: round_length || 6,
          }}
          onSubmit={async (values, { setSubmitting }) => {
            const start_at = getEventStartAt(values.event_date, values.event_time)
            const isPublicEvent = values.public_event === 'public'
            const event_details = {
              description: values.description,
              event_name: values.event_name,
              id: eventId || null,
              host_id: userId,
              num_rounds: values.num_rounds,
              public_event: isPublicEvent,
              round_length: values.round_length,
              start_at,
            }
            // if theres no eventId, then we cannot upsert a new event because id is nonNullable
            // so lets just delete the id altogether. Doing this because TS yells at me
            // if I do it another way
            if (event_details.id === null) delete event_details.id
            try {
              await upsertEventMutation({ variables: { event_details } })
            } catch (error) {
              console.log('error', error)
            }
          }}
        >
          {({ submitForm, isSubmitting, values }) => (
            <Form className={classes.eventFormContainer}>
              <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
                className={classes.sectionContainer}
              >
                <Typography variant="h3">Basics</Typography>
                <Grid container direction="row">
                  <Grid container className={classes.eventFormInputMargin}>
                    <Field
                      component={TextField}
                      name="event_name"
                      label="Event Name"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6} className={classes.eventFormInputMargin}>
                    <Field
                      component={DatePicker}
                      name="event_date"
                      label="Event Date"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6} className={classes.eventFormInputMargin}>
                    <Field
                      component={TimePicker}
                      name="event_time"
                      label="Event Time"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid container className={classes.eventFormInputMargin}>
                    <Field
                      component={TextField}
                      multiline
                      name="description"
                      label="Event Description"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid container direction="column" className={classes.eventFormInputMargin}>
                    <FormLabel className={classes.publicEventLabel}>
                      Is this a public (any user can join) or private event?{' '}
                      <span className={classes.pinkText}>*</span>
                    </FormLabel>
                    <Field component={RadioGroup} name="public_event" required>
                      <Grid container direction="row" className={classes.eventFormInputMargin}>
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
                  <Typography variant="h3">Matching Options</Typography>
                  <Field name="matching_type" required>
                    {({ field, form }: { field: any; form: any }) => (
                      <Grid
                        container
                        direction="row"
                        className={classes.matchingOptionCardGrid}
                        wrap="nowrap"
                      >
                        {renderMatchingOptionCards(field, form)}
                      </Grid>
                    )}
                  </Field>
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
                      className={classes.eventFormInputMargin}
                    >
                      <Field
                        component={TextField}
                        name="round_length"
                        label="Round Length (minutes)"
                        type="number"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={3} className={classes.eventFormInputMargin}>
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

export default NewEventForm
