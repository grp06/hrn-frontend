import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Formik, Form, Field, useFormik } from 'formik'
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

const EditCelebProfile = ({ celeb, setIsEditing, updateUserNewObjectInContext }) => {
  const classes = useStyles()
  const { cash_app = '', email, id: celebsId, name, profile_pic_url, venmo = '' } = celeb
  const [updateUserNewMutation] = useMutation(updateUserNew)
  const [showUpdateSuccessSnack, setShowUpdateSuccessSnack] = useState(false)

  const handleFormClose = () => {
    setIsEditing(false)
  }

  const prevCelebValues = { name, email, cash_app, venmo }

  const handleFormSubmit = async ({ setSubmitting, values }) => {
    setSubmitting(true)

    // ? Do we want to be case sensitive when updating?
    const changedValues = Object.keys(values).filter(
      (key) => values[key].toLowerCase() !== prevCelebValues[key].toLowerCase()
    )

    if (changedValues.length > 0) {
      // * Had to comment this out because the mutation needs all values even if they're not changed
      // * but it would be great if we only update changed values
      // const changedValuesObject = changedValues.reduce((initialObj, currentChangedProperty) => {
      //   initialObj[currentChangedProperty] = values[currentChangedProperty]
      //   return initialObj
      // }, {})
      const { name, email, venmo, cash_app } = values
      try {
        const updateUserNewMutationResponse = await updateUserNewMutation({
          variables: {
            id: celebsId,
            name,
            email,
            venmo,
            cash_app,
          },
        })
        await sleep(500)
        setShowUpdateSuccessSnack(true)
        await sleep(500)
        if (updateUserNewMutationResponse) {
          updateUserNewObjectInContext(
            updateUserNewMutationResponse.data.update_users_new.returning[0]
          )
          setIsEditing(false)
        }
      } catch (err) {
        console.log('updateUserNewMutation error ->', err)
      }
    }

    setSubmitting(false)
  }

  const TextFieldRequired = (props) => <TextField required {...props} />

  return (
    <div>
      <Formik
        onSubmit={(values, { setSubmitting }) => handleFormSubmit({ setSubmitting, values })}
        initialValues={{
          cash_app: cash_app || '',
          email,
          name,
          venmo: venmo || '',
        }}
      >
        {({ isSubmitting, values }) => (
          <Form autoComplete="off" className={classes.formContainer}>
            <div>
              <Field
                name="name"
                component={TextFieldRequired}
                fullWidth
                value={values.name}
                id="name"
                label="Full Name"
              />
            </div>
            <div>
              <Field
                name="email"
                component={TextFieldRequired}
                fullWidth
                value={values.email}
                id="email"
                label="Email"
              />
            </div>
            {/* <div>
              <Field
                name="password"
                component={TextFieldRequired}
                fullWidth
                value={values.password}
                id="password"
                label="Password"
              />
            </div> */}
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
