import React, { useState } from 'react'
import * as Yup from 'yup'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { useMutation } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/styles'
import { Snack } from '../../common'
import { signupUserNew } from '../../helpers'
import { constants } from '../../utils'
import { insertEventUserNew } from '../../gql/mutations'

const { USER_ID, TOKEN, ROLE } = constants

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

const RSVPSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').required('Required'),
  phone_number: Yup.string().min(7, 'Too Short!').required('Required'),
})

const RSVPForChitChatForm = ({ chitChat, chitChatId }) => {
  const classes = useStyles()
  const [RSVPFormErrorMessage, setRSVPFormErrorMessage] = useState('')
  const [formSubmitting, setFormSubmitting] = useState(false)
  const { host } = chitChat
  const { name: hostName } = host
  const [insertEventUserNewMutation] = useMutation(insertEventUserNew)

  return (
    <div>
      <Formik
        initialValues={{
          phone_number: '',
          name: '',
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setFormSubmitting(true)
          const { phone_number, name } = values
          if (!phone_number || !name) {
            setRSVPFormErrorMessage('something seems to be empty  🧐')
            setFormSubmitting(false)
            return
          }
          let signupResponse
          try {
            signupResponse = await signupUserNew({
              role: 'fan',
              userInfo: { name, phone_number },
            })
            if (signupResponse.error) {
              setRSVPFormErrorMessage(signupResponse.error)
              throw signupResponse.error
            }
          } catch (err) {
            console.log('err === ', err)
            setRSVPFormErrorMessage(err)
            setFormSubmitting(false)
          }

          const { token, id, role } = signupResponse
          window.analytics.identify(id, {
            name,
            phone_number,
            role,
          })
          window.analytics.track('Sign up fan new')
          localStorage.setItem(USER_ID, id)
          localStorage.setItem(ROLE, role)
          localStorage.setItem(TOKEN, token)
          // create a mutation that makes an entry in event_users_new
          try {
            await insertEventUserNewMutation({
              variables: {
                event_id: chitChatId,
                user_id: id,
              },
            })
          } catch (error) {
            console.log('error = ', error)
          }
          setFormSubmitting(false)
        }}
        validationSchema={RSVPSchema}
      >
        {({ submitForm, dirty, isValid, values }) => (
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
                startIcon={formSubmitting ? <CircularProgress size="1rem" /> : null}
                disabled={formSubmitting || !isValid || !dirty}
                onClick={submitForm}
              >
                Sign me up!
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
      <Snack
        open={Boolean(RSVPFormErrorMessage)}
        onClose={() => setRSVPFormErrorMessage('')}
        severity="error"
        duration={3000}
        snackMessage={RSVPFormErrorMessage}
      />
    </div>
  )
}

export default RSVPForChitChatForm
