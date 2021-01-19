import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Formik, Form, Field } from 'formik'
import { useMutation } from 'react-apollo'
import { updateUserNew } from '../../gql/mutations'
import { useUserContext } from '../../context'
import { FloatCardMediumLarge } from '../../common'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '100px',
  },
  cityInputContainer: {
    padding: theme.spacing(0, 2.5),
  },
  shortBioInputContainer: {
    padding: theme.spacing(0, 2.5),
    marginBottom: theme.spacing(1),
  },
}))

export const OnboardingNew = () => {
  const classes = useStyles()

  const {
    user: { id },
  } = useUserContext()

  const [updateUser] = useMutation(updateUserNew)

  const submit = ({ cashApp, venmo }) => {
    updateUser({ variables: { id, cashApp, venmo } })
  }

  return (
    <div className={classes.container}>
      <FloatCardMediumLarge>
        <Formik initialValues={{ cashApp: '', venmo: '' }} onSubmit={submit}>
          <Form>
            <Field name="cashApp" />
            <Field name="venmo" />
            <button type="submit">Submit</button>
          </Form>
        </Formik>
      </FloatCardMediumLarge>
    </div>
  )
}
