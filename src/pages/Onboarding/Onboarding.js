import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { useQuery, useMutation } from '@apollo/react-hooks'
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
}))

const Onboarding = () => {
  const classes = useStyles()
  const { data: tagsData, loading: tagsLoading } = useQuery(getAllTags)

  if (tagsLoading) {
    return <Loading />
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
          <div label="location">
            <Box paddingBottom={2}>
              <Field name="location" component={TextField} label="Location" fullWidth />
            </Box>
          </div>
          <div label="interests">
            {/* <Field name="interests" component={InterestTagInputComponent} /> */}
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
