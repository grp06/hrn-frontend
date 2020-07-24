import React, { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Geosuggest from 'react-geosuggest'
import { Snack } from '../../common'
import { makeStyles } from '@material-ui/styles'
import { useMutation } from '@apollo/react-hooks'
import { insertUserTags } from '../../gql/mutations'
import { sleep } from '../../helpers'
import { TextField } from 'formik-material-ui'
import { OnboardingInterestTagInput } from '../Onboarding'
import { useAppContext } from '../../context/useAppContext'
import './geosuggest.css'

const useStyles = makeStyles((theme) => ({
  formContainer: {
    width: '80%',
    margin: theme.spacing(3, 'auto'),
  },
  geosuggestContainer: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  tagsContainer: {
    width: '100%',
    marginTop: theme.spacing(5),
  },
  geosuggestInput: {
    width: '100%',
    padding: theme.spacing(0.5, 0),
    fontSize: '1rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid #3e4042',
    fontWeight: '300',
    color: theme.palette.common.ghostWhiteBody,
    fontFamily: 'Muli',
    marginTop: theme.spacing(3),
  },
  geosuggestSuggests: {
    marginTop: 0,
    backgroundColor: theme.palette.common.greyHighlight,
    borderRadius: '4px',
  },
  geosuggestItem: {
    width: '100%',
    fontFamily: 'Muli',
    color: theme.palette.common.ghostWhite,
    padding: theme.spacing(1, 0),
    borderBottom: '1px solid #3e4042',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.palette.common.greyBorder,
    },
  },
  buttonContainer: {
    width: '65%',
    [theme.breakpoints.down('md')]: {
      width: '50%',
    },
    margin: theme.spacing(0, 'auto'),
  },
  cancelButton: {
    margin: theme.spacing(1.5, 0),
    backgroundColor: theme.palette.common.greyButton,
    color: theme.palette.common.ghostWhite,
    '&:hover': {
      backgroundColor: theme.palette.common.greyButtonHover,
    },
  },
}))

const EditProfileSidebarForm = ({ databaseTags, onClose }) => {
  const classes = useStyles()
  const { setUsersTags, user } = useAppContext()
  const { userId, tags_users: usersTags, name: usersName, city: usersCity } = user
  const [showSubmitSuccessSnack, setShowSubmitSuccessSnack] = useState(false)
  const [insertUserTagsMutation] = useMutation(insertUserTags)
  console.log('databaseTags ->', databaseTags)

  const usersTagsAsFormInput = usersTags.map((tagObject) => {
    return { tag_id: tagObject.tag.tag_id, user_id: userId }
  })

  useEffect(() => {
    const geosuggestLabelDOMElement = document.getElementById('geosuggest-label')
    const geosuggestUnderlineDOMElement = document.getElementById('geosuggest-form-container')
    geosuggestLabelDOMElement.classList.add(
      'MuiFormLabel-root',
      'MuiInputLabel-root',
      'MuiInputLabel-formControl',
      'MuiInputLabel-animated',
      'MuiInputLabel-shrink',
      'MuiFormLabel-filled'
    )
    geosuggestUnderlineDOMElement.classList.add(
      // 'MuiInputBase-root',
      'MuiInput-root',
      // 'MuiInput-underline',
      'MuiInputBase-fullWidth',
      'MuiInput-fullWidth',
      'MuiInputBase-formControl',
      'MuiInput-formControl'
    )
    // console.log(geosuggestDOMElement)
  }, [])

  const handleFormClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleFormSubmit = async (values) => {
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
      setUsersTags(insertTagMutationResponse.data.insert_tags_users.returning[0].user.tags_users)
    }
    if (onClose) {
      onClose()
    }
  }

  return (
    <div>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{
          name: usersName,
          city: usersCity,
          selectedTags: usersTags,
        }}
      >
        {({ isSubmitting, values }) => (
          <Form autoComplete="off" className={classes.formContainer}>
            <div className={classes.locationInputContainer}>
              <Field
                name="name"
                component={TextField}
                fullWidth
                value={values.name}
                id="name"
                label="name"
              />
            </div>
            <Field name="city">
              {({ form }) => (
                <>
                  <div id="geosuggest-form-container" className={classes.geosuggestContainer}>
                    <div id="geosuggest-label">city</div>
                    <Geosuggest
                      placeholder="Type in your city"
                      types={['(cities)']}
                      initialValue={values.city}
                      ignoreTab
                      inputClassName={classes.geosuggestInput}
                      suggestsClassName={classes.geosuggestSuggests}
                      suggestItemClassName={classes.geosuggestItem}
                      onSuggestSelect={(suggest) => {
                        if (suggest) {
                          console.log(suggest.gmaps.name)
                          form.setFieldValue('city', suggest.gmaps.name)
                        }
                      }}
                    />
                  </div>
                </>
              )}
            </Field>
            <Field name="selectedTags">
              {({ field, form }) => (
                <div className={classes.tagsContainer}>
                  <OnboardingInterestTagInput
                    tagsData={databaseTags.tags}
                    userId={userId}
                    usersTags={usersTagsAsFormInput}
                    value={field.value}
                    onChange={(selectedTags) => {
                      console.log('I got the value correctly from my child: ', selectedTags)
                      form.setFieldValue('selectedTags', selectedTags)
                    }}
                  />
                </div>
              )}
            </Field>
            <Grid
              container
              item
              direction="row"
              justify="space-around"
              alignItems="center"
              wrap="wrap"
              className={classes.buttonContainer}
            >
              <Button
                startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                disabled={isSubmitting}
                variant="contained"
                color="primary"
                type="submit"
              >
                {isSubmitting ? 'Saving' : 'Save'}
              </Button>
              <Button variant="outlined" className={classes.cancelButton} onClick={handleFormClose}>
                Cancel
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

export default EditProfileSidebarForm
