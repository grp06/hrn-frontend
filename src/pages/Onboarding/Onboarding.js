import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { useQuery } from '@apollo/react-hooks'
import Box from '@material-ui/core/Box'
import { Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { FloatCardMedium, Loading } from '../../common'
import { FormikOnboardingStepper, OnboardingInterestTagInput } from './'
import { getAllTags } from '../../gql/queries'
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
  const InterestTagInputComponent = () => <OnboardingInterestTagInput tagsData={tagsData.tags} />

  return (
    <div className={classes.container}>
      <FloatCardMedium>
        <FormikOnboardingStepper
          initialValues={{
            firstName: '',
            lastName: '',
            userBio: '',
            jobTitle: '',
            location: '',
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
            <Field name="interests" component={InterestTagInputComponent} />
            {/* <Box paddingBottom={2}>
              <Field name="userBio" component={TextField} label="User Bio" fullWidth />
            </Box>
            <Box paddingBottom={2}>
              <Field name="jobTitle" component={TextField} label="Job Title" fullWidth />
            </Box> */}
          </div>
        </FormikOnboardingStepper>
      </FloatCardMedium>
    </div>
  )
}

export default Onboarding
