import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Geosuggest from 'react-geosuggest'
import { Field } from 'formik'
import { useHistory } from 'react-router-dom'
import { FloatCardMedium, GeosuggestCityInput, Loading, Snack } from '../../common'
import { FormikOnboardingStepper, OnboardingInterestTagInput } from './'
import { getAllTags } from '../../gql/queries'
import { insertUserTags, updateUser } from '../../gql/mutations'
import { sleep } from '../../helpers'
import { useAppContext } from '../../context/useAppContext'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '200px',
  },
  cityInputContainer: {
    padding: theme.spacing(0, 2.5),
  },
}))

const Onboarding = () => {
  const classes = useStyles()
  const history = useHistory()
  const { setUsersTags, user, app } = useAppContext()
  const { appLoading } = app
  const { userId, city: usersCityInContext, tags_users: usersTagsInContext, name: userName } = user
  const [showSubmitSuccessSnack, setShowSubmitSuccessSnack] = useState(false)
  const { data: tagsData, loading: tagsLoading } = useQuery(getAllTags)
  const [updateUserMutation] = useMutation(updateUser)
  const [insertUserTagsMutation] = useMutation(insertUserTags)

  if (appLoading || tagsLoading) {
    return <Loading />
  }

  console.log('tagsData ->', tagsData)

  // Onboarding should only be displayed directly after signing up
  if (usersCityInContext || usersTagsInContext.length) {
    history.push('/events')
  }

  const handleOnboardingFormSubmit = async (values) => {
    console.log('values', values)
    let insertTagMutationResponse
    try {
      await updateUserMutation({
        variables: {
          id: userId,
          name: userName,
          city: values.city,
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
    } catch (err) {
      console.log('insertUserTagsMutation error ->', err)
    }

    await sleep(500)
    setShowSubmitSuccessSnack(true)
    await sleep(1000)
    if (insertTagMutationResponse.data.insert_tags_users.returning.length) {
      setUsersTags(insertTagMutationResponse.data.insert_tags_users.returning[0].user.tags_users)
    }
  }

  return (
    <div className={classes.container}>
      <FloatCardMedium>
        <FormikOnboardingStepper
          initialValues={{
            city: '',
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
                  userId={userId}
                  value={field.value}
                  onChange={(interests) => {
                    console.log('I got the value correctly from my child: ', interests)
                    form.setFieldValue('interests', interests)
                  }}
                />
              )}
            </Field>
          </div>
        </FormikOnboardingStepper>
        <Snack
          open={showSubmitSuccessSnack}
          onClose={() => {
            setShowSubmitSuccessSnack(false)
            // check to see if we were redirected here by an event
            const eventIdInLocalStorage = localStorage.getItem('eventId')
            if (eventIdInLocalStorage) {
              history.push(`/events/${eventIdInLocalStorage}`)
              return
            }
            history.push('/events')
          }}
          duration={1500}
          snackMessage="Updated our books!"
        />
      </FloatCardMedium>
    </div>
  )
}

export default Onboarding
