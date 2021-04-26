import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { Grid, Button, CircularProgress } from '@material-ui/core'
import { useMutation } from '@apollo/react-hooks'
import { TextField } from 'formik-material-ui'
import { useMyProfileStyles } from '.'
import { deleteUsersTags, insertUserTags, updateUser } from '../../gql/mutations'
import { sleep } from '../../helpers'
import { OnboardingInterestTagInput } from '../Onboarding'
import { useUserContext } from '../../context'
import { GeosuggestCityInput, Snack } from '../../common'

const EditProfileSidebarForm = ({ databaseTags, onClose }) => {
  const classes = useMyProfileStyles()
  const { setUsersTags, updateUserObject, user } = useUserContext()
  const {
    id: userId,
    tags_users: usersTags,
    first_name,
    last_name,
    city: usersCity,
    short_bio: usersShortBio,
    linkedIn_url: usersLinkedIn,
  } = user

  const [submitErrorSnackMessage, setSubmitErrorSnackMessage] = useState(null)
  const [showSubmitErrorSnack, setShowSubmitErrorSnack] = useState(false)
  const [showSubmitSuccessSnack, setShowSubmitSuccessSnack] = useState(false)
  const [updateUserMutation] = useMutation(updateUser)
  const [insertUserTagsMutation] = useMutation(insertUserTags)
  const [deleteUsersTagsMutation] = useMutation(deleteUsersTags)
  const linkedInRegex = /linkedin/

  const usersTagsAsFormInput = usersTags.map((tagObject) => ({
    tag_id: tagObject.tag.tag_id,
    user_id: userId,
  }))

  const handleFormClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleFormSubmit = async (values) => {
    let updateUserMutationResponse
    let insertTagMutationResponse
    if (
      !values.first_name ||
      !values.last_name ||
      !values.city ||
      !values.selectedTags ||
      values.selectedTags.length < 3
    ) {
      setSubmitErrorSnackMessage('something seems to be empty or not enough tags  🧐')
      return setShowSubmitErrorSnack(true)
    }
    if (values.linkedIn_url) {
      const linkedInInUrl = Boolean(values.linkedIn_url.match(linkedInRegex))
      if (!linkedInInUrl) {
        setSubmitErrorSnackMessage('We only allow linkedIn urls')
        return setShowSubmitErrorSnack(true)
      }
    }
    const userChangedFirstName = !(values.first_name === first_name)
    const userChangedLastName = !(values.last_name === last_name)
    const userChangedCity = !(values.city === usersCity)
    const userChangedShortBio = !(values.short_bio === usersShortBio)
    const userChangedLinkedIn = !(values.linkedIn_url === usersLinkedIn)

    // Update User City, Name, ShortBio, LinkedIn
    if (
      userChangedFirstName ||
      userChangedLastName ||
      userChangedCity ||
      userChangedShortBio ||
      userChangedLinkedIn
    ) {
      try {
        updateUserMutationResponse = await updateUserMutation({
          variables: {
            id: userId,
            first_name: values.first_name,
            last_name: values.last_name,
            city: values.city,
            short_bio: values.short_bio,
            linkedIn_url: values.linkedIn_url,
          },
        })
        // add email to segment call once we eventually enable users to update their email address
        window.analytics.identify(userId, {
          name: values.first_name + values.last_name,
          city: values.city,
        })
      } catch (err) {
        console.log('updateUserMutation error ->', err)
      }
    }

    window.analytics.track('Profile updated')

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
          first_name,
          last_name,
          city: usersCity,
          selectedTags: usersTags,
          short_bio: usersShortBio || '',
          linkedIn_url: usersLinkedIn || '',
        }}
      >
        {({ isSubmitting, values }) => (
          <Form autoComplete="off" className={classes.myProfileSidebarFormContainer}>
            <div>
              <Field
                name="first_name"
                component={TextField}
                fullWidth
                value={values.first_name}
                id="first_name"
                label="First Name"
              />
            </div>
            <div>
              <Field
                name="last_name"
                component={TextField}
                fullWidth
                value={values.last_name}
                id="last_name"
                label="Last Name"
              />
            </div>
            <Field name="city">
              {({ form }) => (
                <GeosuggestCityInput
                  placeholder="Type in your city"
                  initialValue={values.city}
                  onSuggestSelectCallback={(suggest) => {
                    if (suggest) {
                      form.setFieldValue('city', suggest.gmaps.name)
                    }
                  }}
                />
              )}
            </Field>
            <div>
              <Field
                name="linkedIn_url"
                component={TextField}
                fullWidth
                value={values.linkedIn_url}
                id="linkedIn_url"
                label="Your LinkedIn Profile URL"
              />
            </div>
            <div>
              <Field
                name="short_bio"
                component={TextField}
                fullWidth
                value={values.short_bio}
                id="short_bio"
                multiline
                autoFocus={!values.short_bio}
                margin="normal"
                label="a quick blurb about yourself for others to get to know you"
                placeholder="I'm Sarah! A web developer for Intel for the past 2 years who has a low-key bad obsession with iced coffees and petting peoples dogs. I've recently been practicing a lot of poi and have been perfecting my banana bread recipe during this quarantine 😋 "
              />
            </div>
            <Field name="selectedTags">
              {({ field, form }) => (
                <div className={classes.tagsContainer}>
                  <OnboardingInterestTagInput
                    tagsData={databaseTags.tags}
                    userId={userId}
                    usersTags={usersTagsAsFormInput}
                    value={field.value}
                    onChange={(selectedTags) => {
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
      <Snack
        open={showSubmitErrorSnack}
        onClose={() => {
          setShowSubmitErrorSnack(false)
        }}
        duration={3000}
        severity="error"
        snackMessage={submitErrorSnackMessage}
      />
    </div>
  )
}

export default EditProfileSidebarForm
