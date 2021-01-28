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
import { sleep } from '../../helpers'
import { upsertChitChat } from '../../gql/mutations'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  cancelButton: {
    margin: theme.spacing(2, 0),
    backgroundColor: theme.palette.common.greyButton,
    color: theme.palette.common.ghostWhite,
    '&:hover': {
      backgroundColor: theme.palette.common.greyButtonHover,
    },
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(2),
    },
  },
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
  pageContainer: {
    marginTop: '75px',
    [theme.breakpoints.down('sm')]: {
      marginTop: '100px',
      marginBottom: '25px',
    },
  },
  pinkText: {
    color: theme.palette.common.basePink,
  },
  sectionContainer: {
    margin: theme.spacing(4, 0, 2, 0),
  },
}))

const CreateChitChatForm = ({ chitChatDetails, userId }) => {
  const classes = useStyles()
  const history = useHistory()
  const [showCreateChitChatSuccess, setShowCreateChitChatSuccess] = useState(false)
  const [upsertChitChatMutation] = useMutation(upsertChitChat, {
    onCompleted: async (data) => {
      const {
        id: event_id,
        num_rounds,
        round_length,
        suggested_donation,
      } = data.insert_chit_chats.returning[0]
      window.analytics.track('Event New created', {
        num_rounds,
        round_length,
        suggested_donation,
      })
      setShowCreateChitChatSuccess(true)
      await sleep(800)
      history.push(`/chit-chat/${event_id}`)
    },
  })
  const { id: chitChatId, num_rounds, round_length, start_at, suggested_donation } =
    chitChatDetails || {}

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

  const handleCancelClick = () => {
    if (chitChatId) return history.push(`/chit-chat/${chitChatId}`)
    return history.push('/creator-home')
  }

  return (
    <>
      <Typography variant="h2" style={{ fontWeight: 700, marginBottom: '10px' }}>
        {chitChatDetails ? 'Edit Your Event' : 'Create Event'}
      </Typography>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Formik
          initialValues={{
            event_date: new Date(start_at) || new Date(),
            event_time: new Date(start_at) || new Date(),
            num_rounds: num_rounds || 15,
            round_length: round_length || 2,
            suggested_donation: suggested_donation || 5,
          }}
          onSubmit={async (values, { setSubmitting }) => {
            const { event_date, event_time, num_rounds, round_length, suggested_donation } = values
            const start_at = getEventStartAt(event_date, event_time)
            const event_details = {
              host_id: userId,
              num_rounds,
              round_length,
              start_at,
              suggested_donation,
            }
            // this is for adding the chit chat id if we are editing, instead of creating
            if (chitChatId) event_details.id = chitChatId
            try {
              await upsertChitChatMutation({ variables: { event_details } })
              setSubmitting(false)
            } catch (error) {
              console.log('error')
              setSubmitting(false)
            }
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
                      label="Date"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6} className={classes.formInputMargin}>
                    <Field
                      component={TimePicker}
                      name="event_time"
                      label="Time"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6} className={classes.formInputMargin}>
                    <Field
                      component={TextField}
                      name="suggested_donation"
                      label="Suggested Donation Value (USD)"
                      fullWidth
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
                    <Grid item xs={12} md={6} className={classes.formInputMargin}>
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
                  <Typography variant="subtitle2" style={{ padding: '0 8px' }}>
                    This is a suggested length so you have enough time to make a good impression and
                    get donations!
                  </Typography>
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
                <Button
                  variant="contained"
                  color="inherit"
                  className={classes.cancelButton}
                  onClick={handleCancelClick}
                >
                  Cancel
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
    </>
  )
}

export default CreateChitChatForm
