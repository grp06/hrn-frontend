import React from 'react'
import { motion } from 'framer-motion'
import { Field } from 'formik'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/styles'

import { HostOnboardingStep } from '.'
import { FloatCardMediumLarge } from '../../common'
import { sleep } from '../../helpers'
import { FormikOnboardingStepper } from '../Onboarding'

const useStyles = makeStyles((theme) => ({
  skipButton: {
    position: 'absolute',
    left: 'auto',
    right: '0%',
    bottom: 'auto',
    top: '0%',
    textTransform: 'none',
    color: theme.palette.common.ghostWhiteDark,
    fontWeight: 200,
  },
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

const HostOnboardingForm = ({ onFormSkip, onFormSubmit }) => {
  const classes = useStyles()
  return (
    <motion.div initial={{ x: 2000 }} animate={{ x: 0, transition: { duration: 0.55 } }}>
      <FloatCardMediumLarge>
        <FormikOnboardingStepper
          initialValues={{
            community_type: '',
            currently_organize: '',
            frequency: '',
          }}
          onSubmit={async (values) => {
            console.log(values)
            await sleep(500)
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
        <Button variant="text" disableRipple className={classes.skipButton} onClick={onFormSkip}>
          Skip
        </Button>
      </FloatCardMediumLarge>
    </motion.div>
  )
}

export default HostOnboardingForm
