import React from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
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

const RSVPForEventNewForm = ({ eventNew }) => {
  const classes = useStyles()
  const { host } = eventNew
  const { name: hostName } = host
  return (
    <Formik
      initialValues={{
        phone_number: '',
        name: '',
      }}
      onSubmit={async (values, { setSubmitting }) => {
        const { phone_number, name } = values
        // TODO hit the backend and create a user_new
        // get the id from that
        // create a mutation that makes an entry in event_users_new
        setSubmitting(false)
      }}
    >
      {({ submitForm, isSubmitting, values }) => (
        <Form className={classes.formContainer}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            className={classes.sectionContainer}
          >
            <Typography variant="h3">
              Get the chance to meet {hostName}{' '}
              <span role="img" aria-label="hooray smiley">
                🥳
              </span>
            </Typography>
            <Grid container direction="row">
              <Grid item xs={12} className={classes.formInputMargin}>
                <Field component={TextField} name="name" label="Your name" type="text" required />
              </Grid>
              <Grid item xs={12} className={classes.formInputMargin}>
                <Field
                  component={TextField}
                  name="phone_number"
                  label="Your phone number"
                  type="text"
                  required
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
              Sign me up!
            </Button>
          </Grid>
        </Form>
      )}
    </Formik>
  )
}

export default RSVPForEventNewForm
