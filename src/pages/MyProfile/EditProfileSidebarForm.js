import React, { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import { Snack } from '../../common'
import { makeStyles } from '@material-ui/styles'
import { useMutation } from '@apollo/react-hooks'
import { deleteUsersTags, insertUserTags, updateUser } from '../../gql/mutations'
import { sleep } from '../../helpers'
import { TextField } from 'formik-material-ui'
import { OnboardingInterestTagInput } from '../Onboarding'
import { useAppContext } from '../../context/useAppContext'
import { GeosuggestCityInput } from '../../common'

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

const EditProfileSidebarForm = ({ databaseTags, onClose }) => {
  const classes = useStyles()
  const { setUsersTags, updateUserObject, user } = useAppContext()
  const { userId, tags_users: usersTags, name: usersName, city: usersCity } = user
  const [showSubmitSuccessSnack, setShowSubmitSuccessSnack] = useState(false)
  const [updateUserMutation] = useMutation(updateUser)
  const [insertUserTagsMutation] = useMutation(insertUserTags)
  const [deleteUsersTagsMutation] = useMutation(deleteUsersTags)

  const usersTagsAsFormInput = usersTags.map((tagObject) => {
    return { tag_id: tagObject.tag.tag_id, user_id: userId }
  })

  const handleFormClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleFormSubmit = async (values) => {
    let updateUserMutationResponse
    let insertTagMutationResponse
    const userChangedName = !(values.name === usersName)
    const userChangedCity = !(values.city === usersCity)

    // Update User City and Name
    if (userChangedName || userChangedCity) {
      try {
        updateUserMutationResponse = await updateUserMutation({
          variables: {
            id: userId,
            name: values.name,
            city: values.city,
          },
        })
      } catch (err) {
        console.log('updateUserMutation error ->', err)
      }
    }

    // Delete all users tags
    if (usersTags.length > 0) {
      try {
        await deleteUsersTagsMutation({
          variables: {
            user_id: userId,
          },
        })
      } catch (err) {
        console.log('deleteUsersTagsMutation error ->', err)
      }
    }

    // Insert Users Tags
    try {
      insertTagMutationResponse = await insertUserTagsMutation({
        variables: {
          objects: values.selectedTags,
        },
      })
    } catch (err) {
      console.log('insertUserTagsMutation error ->', err)
    }

    await sleep(500)
    setShowSubmitSuccessSnack(true)
    await sleep(500)

    console.log('updateUserMutationResponse ->', updateUserMutationResponse)
    if (
      updateUserMutationResponse &&
      updateUserMutationResponse.data.update_users.returning.length
    ) {
      updateUserObject(updateUserMutationResponse.data.update_users.returning[0])
    }
    if (
      insertTagMutationResponse &&
      insertTagMutationResponse.data.insert_tags_users.returning.length
    ) {
      setUsersTags(insertTagMutationResponse.data.insert_tags_users.returning[0].user.tags_users)
    }
    if (onClose) {
      onClose()
    }
  }

  return (
    <div>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{
          name: usersName,
          city: usersCity,
          selectedTags: usersTags,
        }}
      >
        {({ isSubmitting, values }) => (
          <Form autoComplete="off" className={classes.formContainer}>
            <div className={classes.locationInputContainer}>
              <Field
                name="name"
                component={TextField}
                fullWidth
                value={values.name}
                id="name"
                label="name"
              />
            </div>
            <Field name="city">
              {({ form }) => (
                <GeosuggestCityInput
                  placeholder="Type in your city"
                  initialValue={values.city}
                  onSuggestSelectCallback={(suggest) => {
                    if (suggest) {
                      console.log(suggest.gmaps.name)
                      form.setFieldValue('city', suggest.gmaps.name)
                    }
                  }}
                />
              )}
            </Field>
            <Field name="selectedTags">
              {({ field, form }) => (
                <div className={classes.tagsContainer}>
                  <OnboardingInterestTagInput
                    tagsData={databaseTags.tags}
                    userId={userId}
                    usersTags={usersTagsAsFormInput}
                    value={field.value}
                    onChange={(selectedTags) => {
                      console.log('I got the value correctly from my child: ', selectedTags)
                      form.setFieldValue('selectedTags', selectedTags)
                    }}
                  />
                </div>
              )}
            </Field>
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
        open={showSubmitSuccessSnack}
        onClose={() => {
          setShowSubmitSuccessSnack(false)
        }}
        duration={1500}
        snackMessage="Updated our books!"
      />
    </div>
  )
}

export default EditProfileSidebarForm
