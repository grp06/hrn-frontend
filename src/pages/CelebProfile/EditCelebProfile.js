import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import { Snack } from '../../common'
import { updateUserNew } from '../../gql/mutations'
import { sleep } from '../../helpers'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  formContainer: {
    width: '80%',
    margin: theme.spacing(3, 'auto'),
  },
  tagsContainer: {
    width: '100%',
    marginTop: theme.spacing(5),
  },
  buttonContainer: {
    width: '65%',
    [theme.breakpoints.down('md')]: {
      width: '50%',
    },
    margin: theme.spacing(0, 'auto'),
  },
  cancelButton: {
    margin: theme.spacing(1.5, 0),
    backgroundColor: theme.palette.common.greyButton,
    color: theme.palette.common.ghostWhite,
    '&:hover': {
      backgroundColor: theme.palette.common.greyButtonHover,
    },
  },
}))

const EditCelebProfile = ({ celeb, setCelebProfileContent, updateUserNewObjectInContext }) => {
  const classes = useStyles()
  const {
    cash_app,
    email: celebsEmail,
    id: celebsId,
    name: celebsName,
    profile_pic_url,
    venmo,
  } = celeb
  const [updateUserNewMutation] = useMutation(updateUserNew)
  const [showUpdateSuccessSnack, setShowUpdateSuccessSnack] = useState(false)

  const handleFormClose = () => {
    setCelebProfileContent('celeb-profile')
  }

  const handleFormSubmit = async ({ setSubmitting, values }) => {
    setSubmitting(true)
    const celebChangedName = !(values.name === celebsName)
    const celebChangedEmail = !(values.email === celebsEmail)
    const celebChangedCashApp = !(values.cash_app === cash_app)
    const celebChangedVenmo = !(values.venmo === venmo)

    if (celebChangedName || celebChangedEmail || celebChangedCashApp || celebChangedVenmo) {
      const { cash_app, email, name, venmo } = values
      try {
        const updateUserNewMutationResponse = await updateUserNewMutation({
          variables: {
            cash_app,
            id: celebsId,
            email,
            name,
            venmo,
          },
        })

        await sleep(500)
        setShowUpdateSuccessSnack(true)
        await sleep(500)

        if (updateUserNewMutationResponse) {
          updateUserNewObjectInContext(
            updateUserNewMutationResponse.data.update_users_new.returning[0]
          )
          setCelebProfileContent('celeb-profile')
        }
      } catch (err) {
        console.log('updateUserNewMutation error ->', err)
      }
    }
    setSubmitting(false)
  }

  return (
    <div>
      <Formik
        onSubmit={(values, { setSubmitting }) => handleFormSubmit({ setSubmitting, values })}
        initialValues={{
          cash_app: cash_app || '',
          email: celebsEmail,
          name: celebsName,
          venmo: venmo || '',
        }}
      >
        {({ isSubmitting, values }) => (
          <Form autoComplete="off" className={classes.formContainer}>
            <div>
              <Field
                name="name"
                component={TextField}
                fullWidth
                value={values.name}
                id="name"
                label="Full Name"
              />
            </div>
            <div>
              <Field
                name="email"
                component={TextField}
                fullWidth
                value={values.email}
                id="email"
                label="Email"
              />
            </div>
            <div>
              <Field
                name="cash_app"
                component={TextField}
                fullWidth
                value={values.cash_app}
                id="cash_app"
                label="Cash App"
              />
            </div>
            <div>
              <Field
                name="venmo"
                component={TextField}
                fullWidth
                value={values.venmo}
                id="venmo"
                label="Venmo"
              />
            </div>
            <Grid
              container
              item
              direction="row"
              justify="space-around"
              alignItems="center"
              wrap="wrap"
              className={classes.buttonContainer}
            >
              <Button
                startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                disabled={isSubmitting}
                variant="contained"
                color="primary"
                type="submit"
              >
                {isSubmitting ? 'Saving' : 'Save'}
              </Button>
              <Button variant="outlined" className={classes.cancelButton} onClick={handleFormClose}>
                Cancel
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
      <Snack
        open={showUpdateSuccessSnack}
        onClose={() => {
          setShowUpdateSuccessSnack(false)
        }}
        duration={1500}
        snackMessage="Updated our books!"
      />
    </div>
  )
}

export default EditCelebProfile
