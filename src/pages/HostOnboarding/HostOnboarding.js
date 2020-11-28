import React from 'react'
import { Field } from 'formik'
import { makeStyles } from '@material-ui/styles'

import { HostOnboardingStep } from '.'
import { FloatCardMediumLarge } from '../../common'
import { FormikOnboardingStepper } from '../Onboarding'

const useStyles = makeStyles((theme) => ({
  container: {},
}))

const communityTypeOptions = [
  'Free community',
  'Paid community',
  'Small and medium-sized business',
  'Large enterprise',
  'VC / Accelerator / Startup Incubator',
  'University / Educational institution',
  'Nonprofit organization',
  'Startup',
  'Others',
]

const currentlyOrganizeOptions = [
  'Networking',
  'Webinars',
  'Conferences',
  'Workshops / Trainings',
  'None',
]

const frequencyOptions = ['Weekly', 'Bi-weekly', 'Monthly', 'A few times a year']

const HostOnboarding = () => {
  const classes = useStyles()
  return (
    <FloatCardMediumLarge>
      <FormikOnboardingStepper
        initialValues={{
          community_type: '',
          currently_organize: '',
          frequency: '',
        }}
        onHandleSubmit={() => console.log('hi')}
        isHostOnboarding
      >
        <div label="community">
          <Field name="community_type">
            {({ field, form }) => (
              <HostOnboardingStep
                question="What describes your community best"
                options={communityTypeOptions}
                value={field.value}
                onChange={(answer) => {
                  form.setFieldValue('community_type', answer)
                }}
              />
            )}
          </Field>
        </div>
        <div label="events">
          <Field name="currently_organize">
            {({ field, form }) => (
              <HostOnboardingStep
                question="What types of events do you currently organize?"
                options={currentlyOrganizeOptions}
                value={field.value}
                onChange={(answer) => {
                  form.setFieldValue('currently_organize', answer)
                }}
              />
            )}
          </Field>
        </div>
        <div label="frequency">
          <Field name="frequency">
            {({ field, form }) => (
              <HostOnboardingStep
                question="How often do you plan to connect your community on Hi Right Now?"
                options={frequencyOptions}
                value={field.value}
                onChange={(answer) => {
                  form.setFieldValue('frequency', answer)
                }}
              />
            )}
          </Field>
        </div>
      </FormikOnboardingStepper>
    </FloatCardMediumLarge>
  )
}

export default HostOnboarding
