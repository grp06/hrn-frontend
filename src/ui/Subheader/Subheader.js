import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Button from '@material-ui/core/Button'
import MuiAlert from '@material-ui/lab/Alert'
import { useAppContext } from '../../context/useAppContext'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  subheaderContainer: {
    width: '70vw',
    padding: theme.spacing(3),
    position: 'fixed',
    top: '7%',
    left: '15vw',
    right: '15vw',
    [theme.breakpoints.down('sm')]: {
      top: '12%',
      width: '100vw',
      left: '0%',
      right: '0%',
    },
    // top: '10%',
  },
  darkButton: {
    backgroundColor: theme.palette.common.greyButton,
    color: theme.palette.common.ghostWhite,
    '&:hover': {
      backgroundColor: theme.palette.common.greyButtonHover,
    },
  },
}))

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />

const Subheader = () => {
  const classes = useStyles()
  const history = useHistory()
  const { app, user } = useAppContext()
  const { tags_users: usersTags } = user
  const { appLoading } = app
  const EventHomeRegex = /\/events\/\d+/
  const EventInProgressRegex = /\/events\/\d+\//

  const handleAlertButtonClick = () => {
    history.push('/my-profile')
  }

  if (appLoading) {
    return null
  }

  const onEventsPage = window.location.pathname === '/events'
  const onEventHomePage = Boolean(window.location.pathname.match(EventHomeRegex))
  const onEventInProgressPage = Boolean(window.location.pathname.match(EventInProgressRegex))

  // console.log('onEventsPage ->', onEventsPage)
  // console.log('onEventHomePage ->', onEventHomePage)
  // console.log('onEventInProgressPage ->', onEventInProgressPage)

  const showSubheader =
    usersTags.length === 0 && (onEventsPage || onEventHomePage) && !onEventInProgressPage
  // console.log('showSubheader ->', showSubheader)

  return (
    showSubheader && (
      <div className={classes.subheaderContainer}>
        <Alert
          variant="filled"
          severity="info"
          action={
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.darkButton}
              onClick={handleAlertButtonClick}
            >
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
