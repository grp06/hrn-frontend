import React from 'react'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  formContainer: {
    width: '80%',
    margin: theme.spacing(3, 'auto'),
  },
  tagsContainer: {
    width: '100%',
    marginTop: theme.spacing(5),
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

const EditCelebProfile = ({ celeb, setCelebProfileContent }) => {
  const classes = useStyles()
  const { cash_app, email, name, profile_pic_url, venmo } = celeb

  const handleFormClose = () => {
    setCelebProfileContent('celeb-profile')
  }

  return (
    <Formik
      onSubmit={() => console.log('hello')}
      initialValues={{
        cash_app: cash_app || '',
        email,
        name,
        venmo: venmo || '',
      }}
    >
      {({ isSubmitting, values }) => (
        <Form autoComplete="off" className={classes.formContainer}>
          <div>
            <Field
              name="name"
              component={TextField}
              fullWidth
              value={values.name}
              id="name"
              label="Full Name"
            />
          </div>
          <div>
            <Field
              name="email"
              component={TextField}
              fullWidth
              value={values.email}
              id="email"
              label="Email"
            />
          </div>
          <div>
            <Field
              name="cash_app"
              component={TextField}
              fullWidth
              value={values.cash_app}
              id="cash_app"
              label="Cash App"
            />
          </div>
          <div>
            <Field
              name="venmo"
              component={TextField}
              fullWidth
              value={values.venmo}
              id="venmo"
              label="Venmo"
            />
          </div>
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
  )
}

export default EditCelebProfile
