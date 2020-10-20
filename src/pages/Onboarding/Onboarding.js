import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Field } from 'formik'
import { TextField } from 'formik-material-ui'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'
import { FloatCardMedium, GeosuggestCityInput, Loading, Snack } from '../../common'
import { FormikOnboardingStepper, OnboardingInterestTagInput } from '.'
import { getAllTags } from '../../gql/queries'
import { insertUserTags, updateUser, insertEventUser } from '../../gql/mutations'
import { rsvpForEvent } from '../../utils'
import { sleep } from '../../helpers'
import { useAppContext, useUserContext } from '../../context'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '200px',
  },
  cityInputContainer: {
    padding: theme.spacing(0, 2.5),
  },
  pinkText: {
    color: theme.palette.common.basePink,
  },
  shortBioDesc: {
    marginBottom: theme.spacing(3.5),
  },
  shortBioInputContainer: {
    padding: theme.spacing(0, 2.5),
    marginBottom: theme.spacing(1),
  },
}))

const Onboarding = () => {
  const classes = useStyles()
  const history = useHistory()
  const { appLoading } = useAppContext()
  const { updateUserObject, setUsersTags, user } = useUserContext()
  const {
    id: user_id,
    city: usersCityInContext,
    tags_users: usersTagsInContext,
    name: usersName,
    email: usersEmail,
    role,
  } = user
  const [showSubmitSuccessSnack, setShowSubmitSuccessSnack] = useState(false)
  const { data: tagsData, loading: tagsLoading } = useQuery(getAllTags)
  const [updateUserMutation] = useMutation(updateUser)
  const [insertUserTagsMutation] = useMutation(insertUserTags)

  let eventIdInLocalStorage, eventData, event

  if (localStorage.getItem('eventId') && localStorage.getItem('event')) {
    eventIdInLocalStorage = localStorage.getItem('eventId')
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

  if (appLoading || tagsLoading) {
    return <Loading />
  }

  // Onboarding should only be displayed directly after signing up
  if (usersCityInContext || usersTagsInContext.length) {
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
        },
      })
      rsvpForEvent(event, insertEventUserMutationFunc, usersEmail, usersName)
      history.push(`/events/${eventIdInLocalStorage}`)
    }
  }

  return (
    <div className={classes.container}>
      <FloatCardMedium>
        <FormikOnboardingStepper
          initialValues={{
            city: '',
            short_bio: '',
            interests: [],
          }}
          onSubmit={handleOnboardingFormSubmit}
        >
          <div label="city" className={classes.cityInputContainer}>
            <Field name="city">
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
          <div label="interests">
            <Field name="interests">
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
          </div>
          <div label="short bio" className={classes.shortBioInputContainer}>
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
              label="Short Bio"
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
      </FloatCardMedium>
    </div>
  )
}

export default Onboarding
