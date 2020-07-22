import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Button from '@material-ui/core/Button'
import MuiAlert from '@material-ui/lab/Alert'
import { useAppContext } from '../../context/useAppContext'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  subheaderContainer: {
    width: '50vw',
    position: 'fixed',
    top: '6%',
    left: '25%',
    right: '25%',
    [theme.breakpoints.down('sm')]: {
      top: '11%',
      width: '100vw',
    },
    // top: '10%',
  },
}))

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />

const Subheader = () => {
  const classes = useStyles()
  const history = useHistory()
  const { app, user } = useAppContext()
  const { tags_users: usersTags } = user
  const { appLoading } = app
  const handleAlertButtonClick = () => {
    history.push('/my-profile')
  }

  if (appLoading) {
    return null
  }

  const showSubheader = usersTags.length === 0

  return (
    showSubheader && (
      <div className={classes.subheaderContainer}>
        <Alert
          variant="filled"
          severity="info"
          action={
            <Button color="inherit" size="small" onClick={handleAlertButtonClick}>
              Fill out my tags
            </Button>
          }
        >
          We&apos;ve recently implemented vibe tags to help your future partners get to know you
          better!
        </Alert>
      </div>
    )
  )
}

export default Subheader
