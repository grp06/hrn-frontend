import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { Grid, CircularProgress, Button } from '@material-ui/core'
import { useMutation } from '@apollo/react-hooks'
import { insertUserTags } from '../../gql/mutations'
import { sleep } from '../../helpers'
import { OnboardingInterestTagInput } from '../Onboarding'
import { useUserContext } from '../../context'
import { useMyProfileStyles } from '.'
import { Snack } from '../../common'

const TagsForm = ({ tags, userId, onClose }) => {
  const classes = useMyProfileStyles()
  const { setUsersTags, user } = useUserContext()
  const { tags_users: usersTags } = user
  const [showSubmitSuccessSnack, setShowSubmitSuccessSnack] = useState(false)
  const [insertUserTagsMutation] = useMutation(insertUserTags)

  const usersTagsAsFormInput = usersTags?.map((tagObject) => {
    return { tag_id: tagObject.tag.tag_id, user_id: userId }
  })

  return (
    <div>
      <Formik
        onSubmit={async (values) => {
          let insertTagMutationResponse
          try {
            insertTagMutationResponse = await insertUserTagsMutation({
              variables: {
                objects: values.selectedTags,
              },
            })
          } catch (err) {
            console.log('insertUserTagsMutation error ->', err)
          }

          setShowSubmitSuccessSnack(true)
          await sleep(1000)

          if (insertTagMutationResponse.data.insert_tags_users.returning.length) {
            setUsersTags(
              insertTagMutationResponse.data.insert_tags_users.returning[0].user.tags_users
            )
          }
          if (onClose) {
            onClose()
          }
        }}
        initialValues={{
          selectedTags: [],
        }}
      >
        {({ isSubmitting, values }) => (
          <Form autoComplete="off" className={classes.tagsFormContainer}>
            <Field name="selectedTags">
              {({ field, form }) => (
                <OnboardingInterestTagInput
                  tagsData={tags}
                  userId={userId}
                  usersTags={usersTagsAsFormInput}
                  value={field.value}
                  onChange={(selectedTags) => {
                    form.setFieldValue('selectedTags', selectedTags)
                  }}
                />
              )}
            </Field>
            <Grid container justify="center" alignItems="center">
              <Button
                startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                disabled={isSubmitting}
                variant="contained"
                color="primary"
                type="submit"
              >
                {isSubmitting ? 'Submitting' : 'Submit Your Tags'}
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
      <Snack
        open={showSubmitSuccessSnack}
        onClose={() => {
          setShowSubmitSuccessSnack(false)
        }}
        duration={1500}
        snackMessage="Updated our books!"
      />
    </div>
  )
}

export default TagsForm
