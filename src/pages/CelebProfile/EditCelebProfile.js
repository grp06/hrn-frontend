import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import {
  Button,
  CircularProgress,
  Grid,
  Divider,
  Typography as Typ,
  Avatar,
} from '@material-ui/core'
import { Snack } from '../../common'
import { updateUserNew } from '../../gql/mutations'
import { sleep } from '../../helpers'
import logo from '../../assets/logoWhite.svg'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  avatarLogo: {
    width: '75%',
    height: '75%',
  },
  avatar: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarContainer: {
    backgroundColor: 'transparent',
    width: 88,
    height: 88,
    backgroundColor: theme.palette.common.basePurple,
    margin: '0 auto',
    position: 'relative',
  },
  avatarOverlay: {
    position: 'absolute',
    backgroundColor: theme.palette.common.bodyBlack,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0.7,
    color: theme.palette.common.ghostWhite,
    height: '110%',
    width: '110%',
  },
  avatarButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'transparent',
    color: theme.palette.common.ghostWhite,
    height: '105%',
    width: '100%',
    border: 'none',
    textAlign: 'center',
    fontSize: '0.8rem',
    paddingTop: 65,
    '& input[type="file"]': {
      display: 'none',
    },
  },
  formContainer: {
    width: '80%',
    margin: theme.spacing(3, 'auto'),
    '& .MuiFormControl-root:not(:first-child)': {
      marginTop: '24px',
    },
  },
  tagsContainer: {
    width: '100%',
    marginTop: theme.spacing(5),
  },
  buttonContainer: {
    '& button:first-child': {
      marginTop: 35,
    },
  },
  cancelButton: {
    margin: theme.spacing(1.5, 0),
    backgroundColor: theme.palette.common.greyButton,
    color: theme.palette.common.ghostWhite,
    '&:hover': {
      backgroundColor: theme.palette.common.greyButtonHover,
    },
  },
  divider: {
    marginTop: 35,
    marginBottom: 25,
  },
}))

const EditCelebProfile = ({ celeb, setIsEditing, updateUserNewObjectInContext }) => {
  const classes = useStyles()

  // * The default values for the values below is to avoid the changedValues variable from crashing
  const { cash_app = '', email, id: celebsId, name, profile_pic_url, venmo = '' } = celeb
  const prevCelebValues = { name, email, cash_app, venmo }

  const [showUpdateSuccessSnack, setShowUpdateSuccessSnack] = useState(false)
  const [avatarImage, setAvatarImage] = useState(null)

  const [updateUserNewMutation] = useMutation(updateUserNew, {
    onCompleted: async (data) => {
      const [updatedData] = data.update_users_new.returning
      await sleep(500)
      setShowUpdateSuccessSnack(true)
      await sleep(500)
      if (updatedData) {
        console.log(updatedData)
        updateUserNewObjectInContext(updatedData)
        setIsEditing(false)
      }
    },
    onError: (err) => console.error('updateUserNewMutation error ->', err),
  })

  const handleFormClose = () => {
    setIsEditing(false)
  }

  const submitProfilePicture = async (avatarImageAsParameter) => {
    const formData = new FormData()
    formData.append('file', avatarImageAsParameter)
    formData.append('userId', celebsId)
    const urlAndFile = await await fetch(
      `${process.env.REACT_APP_API_URL}/api/upload/get-signed-url`,
      {
        method: 'POST',
        body: formData,
      }
    ).then((res) => res.json())
    const newFile = new Blob([new Uint8Array(urlAndFile.data.data)], { type: 'image/jpeg' })
    const res = await fetch(urlAndFile.url, {
      method: 'PUT',
      body: newFile,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': avatarImageAsParameter.type,
      },
    })
    const url = res.url.split('?')[0]
    await fetch(`${process.env.REACT_APP_API_URL}/api/upload/save-profile-pic-url`, {
      method: 'POST',
      body: JSON.stringify({ userId: celebsId, url }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return url
  }

  const handleFormSubmit = async ({ setSubmitting, values }) => {
    setSubmitting(true)

    // ? Do we want to be case sensitive when updating?
    const newImageUrl = avatarImage ? await submitProfilePicture(avatarImage) : null

    const changedValues = Object.keys(values).filter(
      (key) => values[key].toLowerCase() !== prevCelebValues[key].toLowerCase()
    )

    if (changedValues.length > 0 || newImageUrl) {
      const changedValuesObject = changedValues.reduce((initialObj, currentChangedProperty) => {
        initialObj[currentChangedProperty] = values[currentChangedProperty]
        return initialObj
      }, {})

      updateUserNewMutation({
        variables: {
          id: celebsId,
          changes: {
            ...changedValuesObject,
            profile_pic_url: newImageUrl,
          },
        },
      })
    }

    setSubmitting(false)
  }

  const handleImageSelect = (e) => {
    const [file] = e.target.files
    setAvatarImage(file)
  }

  const TextFieldRequired = (props) => <TextField required {...props} />

  return (
    <div>
      <Formik
        onSubmit={(values, { setSubmitting }) => handleFormSubmit({ setSubmitting, values })}
        initialValues={{
          cash_app: cash_app || '',
          email,
          name,
          venmo: venmo || '',
        }}
      >
        {({ isSubmitting, values }) => (
          <Form autoComplete="off" className={classes.formContainer}>
            <Avatar className={classes.avatarContainer}>
              <div className={classes.avatarOverlay} />
              <label className={classes.avatarButton}>
                Edit Profile Picture
                <input type="file" accept="image/*" capture="user" onChange={handleImageSelect} />
              </label>

              {profile_pic_url ? (
                <img alt="Profile" className={classes.avatar} src={profile_pic_url} />
              ) : (
                <img alt="company-logo" className={classes.avatarLogo} src={logo} />
              )}
            </Avatar>
            <Field
              name="name"
              component={TextFieldRequired}
              fullWidth
              value={values.name}
              id="name"
              label="Full Name"
            />
            <Field
              name="email"
              component={TextFieldRequired}
              fullWidth
              value={values.email}
              id="email"
              label="Email"
            />
            <Divider className={classes.divider} />
            <Typ variant="subtitle2">How would you like to recieve payment?</Typ>
            <Field
              name="venmo"
              component={TextField}
              fullWidth
              value={values.venmo}
              id="venmo"
              label="Venmo Username"
            />
            <Field
              name="cash_app"
              component={TextField}
              fullWidth
              value={values.cash_app}
              id="cash_app"
              label="Cash App Username"
            />
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
                fullWidth
                startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                disabled={isSubmitting}
                variant="contained"
                color="primary"
                type="submit"
              >
                {isSubmitting ? 'Saving' : 'Confirm'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                className={classes.cancelButton}
                onClick={handleFormClose}
              >
                Cancel
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
      <Snack
        open={showUpdateSuccessSnack}
        onClose={() => {
          setShowUpdateSuccessSnack(false)
        }}
        duration={1500}
        snackMessage="Updated our books!"
      />
    </div>
  )
}

export default EditCelebProfile
