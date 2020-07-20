import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Geosuggest from 'react-geosuggest'
import { Field } from 'formik'
import { useHistory } from 'react-router-dom'
import { FloatCardMedium, Loading } from '../../common'
import { FormikOnboardingStepper, OnboardingInterestTagInput } from './'
import { getAllTags } from '../../gql/queries'
import { insertUserTags, updateUser } from '../../gql/mutations'
import { sleep } from '../../helpers'
import { useAppContext } from '../../context/useAppContext'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '150px',
  },
  locationInputContainer: {
    padding: '0px 20px',
  },
  geosuggestInput: {
    width: '100%',
    padding: '10px 5px',
    fontSize: '1.3rem',
    borderRadius: '4px',
  },
  geosuggestSuggests: {
    marginTop: 0,
    // padding: '10px 0px',
    backgroundColor: theme.palette.common.greyHighlight,
    borderRadius: '4px',
  },
  geosuggestItem: {
    width: '100%',
    fontFamily: 'Muli',
    color: theme.palette.common.ghostWhite,
    padding: '10px 0px',
    borderBottom: '1px solid #3e4042',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.palette.common.greyBorder,
    },
  },
}))

const Onboarding = () => {
  const classes = useStyles()
  const history = useHistory()
  const { user } = useAppContext()
  const { userId, city: usersCityInContext, tags_users: usersTagsInContext, name: userName } = user
  const { data: tagsData, loading: tagsLoading } = useQuery(getAllTags)
  const [updateUserMutation] = useMutation(updateUser)
  const [insertUserTagsMutation] = useMutation(insertUserTags)

  if (tagsLoading) {
    return <Loading />
  }

  // Onboarding should only be displayed directly after signing up
  // if (usersCityInContext || usersTagsInContext.length) {
  //   history.push('/events')
  // }

  const handleSuggestSelect = (suggest, form) => {
    console.log(suggest.gmaps.name)
    form.setFieldValue('location', suggest.gmaps.name)
  }

  const handleOnboardingFormSubmit = async (values) => {
    try {
      await updateUserMutation({
        variables: {
          id: userId,
          name: userName,
          city: values.location,
        },
      })
    } catch (err) {
      console.log('updateUserMutation error ->', err)
    }

    try {
      await insertUserTagsMutation({
        variables: {
          objects: values.interests,
        },
      })
    } catch (err) {
      console.log('insertUserTagsMutation error ->', err)
    }

    await sleep(2000)
    history.push('/events')
    console.log('values', values)
  }

  return (
    <div className={classes.container}>
      <FloatCardMedium>
        <FormikOnboardingStepper
          initialValues={{
            location: '',
            interests: [],
          }}
          onSubmit={handleOnboardingFormSubmit}
        >
          <div label="location" className={classes.locationInputContainer}>
            <Field name="location">
              {({ form }) => (
                <Geosuggest
                  placeholder="Type in your city"
                  types={['(cities)']}
                  ignoreTab
                  inputClassName={classes.geosuggestInput}
                  suggestsClassName={classes.geosuggestSuggests}
                  suggestItemClassName={classes.geosuggestItem}
                  onSuggestSelect={(suggest) => handleSuggestSelect(suggest, form)}
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
      </FloatCardMedium>
    </div>
  )
}

export default Onboarding
