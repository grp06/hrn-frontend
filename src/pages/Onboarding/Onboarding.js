import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Geosuggest from 'react-geosuggest'
import Box from '@material-ui/core/Box'
import { Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { FloatCardMedium, Loading } from '../../common'
import { FormikOnboardingStepper, OnboardingInterestTagInput } from './'
import { getAllTags } from '../../gql/queries'
import { insertUserTags } from '../../gql/mutations'
import { sleep } from '../../helpers'

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
  const { data: tagsData, loading: tagsLoading } = useQuery(getAllTags)

  if (tagsLoading) {
    return <Loading />
  }

  const handleSuggestSelect = (suggest, form) => {
    console.log(suggest.gmaps.name)
    form.setFieldValue('location', suggest.gmaps.name)
  }

  return (
    <div className={classes.container}>
      <FloatCardMedium>
        <FormikOnboardingStepper
          initialValues={{
            location: '',
            interests: [],
          }}
          onSubmit={async (values) => {
            await sleep(3000)
            console.log('values', values)
          }}
        >
          <div label="location" className={classes.locationInputContainer}>
            <Field name="location">
              {({ form }) => (
                <Geosuggest
                  placeholder="Type in your city"
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
