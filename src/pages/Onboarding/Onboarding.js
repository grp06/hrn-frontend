import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { Typography } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { FloatCardMediumLarge, GeosuggestCityInput, Loading, Snack } from '../../common'
import { FormikOnboardingStepper, OnboardingInterestTagInput, useOnboardingStyles } from '.'
import { getAllTags } from '../../gql/queries'
import { insertUserTags, updateUser, insertEventUser } from '../../gql/mutations'
import { rsvpForEvent } from '../../utils'
import { sleep } from '../../helpers'
import { useUserContext } from '../../context'

const Onboarding = () => {
  const classes = useOnboardingStyles()
  const history = useHistory()
  const { updateUserObject, setUsersTags, user, userContextLoading } = useUserContext()
  const {
    id: user_id,
    city: usersCityInContext,
    tags_users: usersTagsInContext,
    name: usersName,
    email: usersEmail,
    role,
  } = user
  const [showSubmitSuccessSnack, setShowSubmitSuccessSnack] = useState(false)
  const { data: tagsData } = useQuery(getAllTags)
  const [updateUserMutation] = useMutation(updateUser)
  const [insertUserTagsMutation] = useMutation(insertUserTags)

  let eventIdInLocalStorage
  let eventData
  let event
  let twoSidedSideInLocalStorage

  if (localStorage.getItem('eventId') && localStorage.getItem('event')) {
    eventIdInLocalStorage = localStorage.getItem('eventId')
    twoSidedSideInLocalStorage = localStorage.getItem('twoSidedSide')
    eventData = JSON.parse(localStorage.getItem('event'))
    event = {
      description: eventData.description,
      event_name: eventData.event_name,
      host: eventData.host,
      id: eventIdInLocalStorage,
      start_at: eventData.start_at,
    }
  }

  const [insertEventUserMutation] = useMutation(insertEventUser)

  if (userContextLoading || !tagsData) {
    return <Loading />
  }

  // Onboarding should only be displayed directly after signing up
  if (usersCityInContext || usersTagsInContext?.length) {
    history.push('/events')
  }

  const handleOnboardingFormSubmit = async (values) => {
    let insertTagMutationResponse
    let updateUserMutationResponse
    try {
      updateUserMutationResponse = await updateUserMutation({
        variables: {
          id: user_id,
          name: usersName,
          city: values.city,
          short_bio: values.short_bio,
        },
      })
    } catch (err) {
      console.log('updateUserMutation error ->', err)
    }

    try {
      insertTagMutationResponse = await insertUserTagsMutation({
        variables: {
          objects: values.interests,
        },
      })
      window.analytics.identify(user_id, {
        name: usersName,
        email: usersEmail,
        role,
        city: values.city,
      })
      window.analytics.track('Onboarding complete', {
        registeredViaEventId: eventIdInLocalStorage || 'none',
      })
    } catch (err) {
      console.log('insertUserTagsMutation error ->', err)
    }

    await sleep(500)
    setShowSubmitSuccessSnack(true)
    await sleep(1000)
    if (
      updateUserMutationResponse &&
      updateUserMutationResponse.data.update_users.returning.length
    ) {
      updateUserObject(updateUserMutationResponse.data.update_users.returning[0])
    }
    if (insertTagMutationResponse.data.insert_tags_users.returning.length) {
      setUsersTags(insertTagMutationResponse.data.insert_tags_users.returning[0].user.tags_users)
    }

    if (eventIdInLocalStorage) {
      // RSVP if there is an event in localStorage
      const insertEventUserMutationFunc = insertEventUserMutation({
        variables: {
          event_id: event.id,
          user_id,
          side: twoSidedSideInLocalStorage,
        },
      })
      rsvpForEvent(event, insertEventUserMutationFunc, usersEmail, usersName)
      history.push(`/events/${eventIdInLocalStorage}`)
    }
  }

  return (
    <div className={classes.onboardingContainer}>
      <FloatCardMediumLarge>
        <FormikOnboardingStepper
          initialValues={{
            city: '',
            short_bio: '',
            interests: [],
          }}
          onSubmit={handleOnboardingFormSubmit}
        >
          <div label="City">
            <Field name="city" label="City" required>
              {({ form }) => (
                <GeosuggestCityInput
                  placeholder="Type in your city"
                  onSuggestSelectCallback={(suggest) => {
                    if (suggest) {
                      console.log(suggest.gmaps.name)
                      form.setFieldValue('city', suggest.gmaps.name)
                    }
                  }}
                />
              )}
            </Field>
          </div>
          <Field name="interests" label="Interests" required>
            {({ field, form }) => (
              <OnboardingInterestTagInput
                tagsData={tagsData.tags}
                userId={user_id}
                value={field.value}
                onChange={(interests) => {
                  form.setFieldValue('interests', interests)
                }}
              />
            )}
          </Field>
          <div label="Short Bio" className={classes.shortBioInputContainer}>
            <Typography variant="subtitle1" className={classes.shortBioDesc}>
              Please provide a short bio that will be used to send out to people who you connect
              with so everyone gets to see how awesome you are{' '}
              <span role="img" aria-label="jazz-hands">
                🤗
              </span>
              .
            </Typography>
            <Field
              name="short_bio"
              component={TextField}
              autoFocus
              fullWidth
              multiline
              placeholder="I'm Sarah! A web developer for Intel for the past 2 years who has a low-key bad obsession with iced coffees and petting peoples dogs. I've recently been practicing a lot of poi and have been perfecting my banana bread recipe during this quarantine 😋 "
            />
          </div>
        </FormikOnboardingStepper>
        <Snack
          open={showSubmitSuccessSnack}
          onClose={() => {
            setShowSubmitSuccessSnack(false)
          }}
          duration={1500}
          snackMessage="Updated our books!"
        />
      </FloatCardMediumLarge>
    </div>
  )
}

export default Onboarding
