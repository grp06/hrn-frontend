import React from 'react'
import { Field } from 'formik'
import { motion } from 'framer-motion'
import { useMutation } from 'react-apollo'
import { Button } from '@material-ui/core'

import { HostOnboardingStep, useHostOnboardingStyles } from '.'
import { FloatCardMediumLarge } from '../../common'
import { insertHostQuestionnaire } from '../../gql/mutations'
import { sleep } from '../../helpers'
import { FormikOnboardingStepper } from '../Onboarding'

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

const HostOnboardingForm = ({ onFormSkip, onFormSubmit, userId }) => {
  const classes = useHostOnboardingStyles()
  const [insertHostQuestionnaireMutation] = useMutation(insertHostQuestionnaire)

  const handleSubmit = (values) => {
    const { community_type, currently_organize, event_frequency } = values
    try {
      insertHostQuestionnaireMutation({
        variables: {
          community_type: community_type.toLowerCase(),
          currently_organize: currently_organize.toLowerCase(),
          event_frequency: event_frequency.toLowerCase(),
          user_id: userId,
        },
      })
      window.analytics.track('submitted host questionnaire')
    } catch (err) {
      console.log('insertHostQuestionnaireMutation error ->', err)
    }
  }

  return (
    <motion.div initial={{ x: 2000 }} animate={{ x: 0, transition: { duration: 0.55 } }}>
      <FloatCardMediumLarge>
        <FormikOnboardingStepper
          initialValues={{
            community_type: '',
            currently_organize: '',
            event_frequency: '',
          }}
          onSubmit={async (values) => {
            handleSubmit(values)
            await sleep(1200)
            onFormSubmit()
          }}
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
            <Field name="event_frequency">
              {({ field, form }) => (
                <HostOnboardingStep
                  question="How often do you plan to connect your community on Hi Right Now?"
                  options={frequencyOptions}
                  value={field.value}
                  onChange={(answer) => {
                    form.setFieldValue('event_frequency', answer)
                  }}
                />
              )}
            </Field>
          </div>
        </FormikOnboardingStepper>
        <Button variant="text" disableRipple className={classes.skipButton} onClick={onFormSkip}>
          Skip
        </Button>
      </FloatCardMediumLarge>
    </motion.div>
  )
}

export default HostOnboardingForm
