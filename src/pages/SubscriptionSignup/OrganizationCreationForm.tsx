import React, { useState } from 'react'
import * as Yup from 'yup'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { Formik, Form, Field } from 'formik'
import { Select, TextField } from 'formik-material-ui'
import { Button, Grid, MenuItem } from '@material-ui/core'
import { useSubscriptionSignupStyles } from '.'
import { Snack } from '../../common'
import { insertOrganization } from '../../gql/mutations'
import { findOrgByNameAndDepartment } from '../../gql/queries'
import { constants } from '../../utils'

const { USER_ID } = constants

const SignupSchema = Yup.object().shape({
  org_name: Yup.string().min(2, 'Too Short!').required('Required'),
  department: Yup.string(),
  team_size: Yup.string().min(2, 'Pick a team size').required('Required'),
})

const OrganizationCreationForm: React.FC<{}> = () => {
  const classes = useSubscriptionSignupStyles()
  const usersId = localStorage.getItem(USER_ID)
  const [department, setDepartment] = useState<string>('')
  const [orgName, setOrgName] = useState<string>('')
  const [teamSize, setTeamSize] = useState<string>('')
  const [errorSnackMessage, setErrorSnackMessage] = useState<string>('')
  const [insertOrganizationMutation] = useMutation(insertOrganization)
  const [getOrginazation] = useLazyQuery(findOrgByNameAndDepartment, {
    fetchPolicy: 'no-cache',
    onCompleted: async (data) => {
      console.log(data)
      if (data.organizations.length === 0 && usersId) {
        try {
          const insertOrgResponse = await insertOrganizationMutation({
            variables: {
              org_object: {
                creator_id: usersId,
                department,
                name: orgName,
                team_size: teamSize,
              },
            },
          })
          console.log('🌈 ~ onCompleted: ~ insertOrgResponse', insertOrgResponse)
        } catch (err) {
          console.log(err)
        }
      } else {
        return setErrorSnackMessage('An organization with that name and department already exists')
      }
    },
  })

  return (
    <>
      <Formik
        validationSchema={SignupSchema}
        initialValues={{
          org_name: '',
          department: '',
          team_size: '',
        }}
        onSubmit={async (values, actions) => {
          const { department, org_name, team_size } = values
          actions.setSubmitting(true)
          setDepartment(department)
          setOrgName(org_name)
          setTeamSize(team_size)
          await getOrginazation({
            variables: {
              department,
              org_name,
            },
          })
          actions.setSubmitting(false)
        }}
      >
        {({ submitForm, isSubmitting, values }) => (
          <Form className={classes.formContainer}>
            <Grid container direction="column" justify="flex-start" alignItems="flex-start">
              <Grid container direction="row">
                <Grid container className={classes.inputSpacing}>
                  <Field
                    component={TextField}
                    name="org_name"
                    label="Organization Name"
                    fullWidth
                    required
                    autoFocus
                    placeholder="Monsters Inc."
                  />
                </Grid>
                <Grid item xs={12} md={6} className={classes.inputSpacing}>
                  <Field
                    component={Select}
                    value={values.department}
                    name="department"
                    fullWidth
                    displayEmpty
                    renderValue={() => (
                      <div>
                        {values.department !== '' ? values.department : 'Pick a Department'}
                      </div>
                    )}
                  >
                    <MenuItem value={'Design'}>Design</MenuItem>
                    <MenuItem value={'Engineering'}>Engineering</MenuItem>
                    <MenuItem value={'HR'}>Human Resources</MenuItem>
                  </Field>
                </Grid>
                <Grid item xs={12} md={6} className={classes.inputSpacing}>
                  <Field
                    component={Select}
                    value={values.team_size}
                    name="team_size"
                    fullWidth
                    displayEmpty
                    required
                    renderValue={() => (
                      <div>{values.team_size !== '' ? values.team_size : 'Pick Team Size'}</div>
                    )}
                  >
                    <MenuItem value={'1 - 10'}>1 - 10 employees</MenuItem>
                    <MenuItem value={'11 - 50'}>11 - 50 employees</MenuItem>
                    <MenuItem value={'51 - 200'}>51 - 200 employees</MenuItem>
                    <MenuItem value={'201 - 500'}>201 - 500 employees</MenuItem>
                    <MenuItem value={'500+'}>500+ employees</MenuItem>
                  </Field>
                </Grid>
              </Grid>
            </Grid>
            <Grid container justify="center" alignItems="center">
              <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
              >
                Submit
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
      <Snack
        open={Boolean(errorSnackMessage)}
        onClose={() => setErrorSnackMessage('')}
        severity="error"
        duration={4000}
        snackMessage={errorSnackMessage}
      />
    </>
  )
}

export default OrganizationCreationForm
