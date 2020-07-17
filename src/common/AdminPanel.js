import React from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import {
  EventForm,
  FloatCardLarge,
  AttendeesList,
  TransitionModal,
  StartPreEventButton,
  ListOfRSVPs,
  ShareEventPromptModal,
  Timer,
  CameraDisabledBanner,
  SetupMicAndCameraButton,
} from '.'
import { useAppContext } from '../context/useAppContext'

const useStyles = makeStyles((theme) => ({
  topDashboard: {
    width: '100%',
    paddingTop: '40px',
    paddingBottom: '40px',
    borderStyle: 'none none solid',
    borderWidth: '1px',
    borderColor: theme.palette.common.greyBorder,
    borderRadius: '4px 4px 0px 0px',
    backgroundColor: theme.palette.common.greyHighlight,
    // backgroundColor: '#3a3b3c',
  },
  categoryHeader: {
    ...theme.typography.h2,
    color: theme.palette.common.ghostWhite,
  },
  sectionHeader: {
    ...theme.typography.h3,
    color: theme.palette.common.ghostWhite,
  },
  displayNumber: {
    fontFamily: 'Muli',
    color: theme.palette.common.orchid,
    fontSize: '4.5rem',
  },
  partyEmoji: {
    marginLeft: 10,
  },
  cardBodyContainer: {
    padding: '50px',
  },
  descriptionContainer: {
    marginBottom: '25px',
  },
  adminButtons: {
    height: 160,
  },
  cameraTest: {
    marginBottom: theme.spacing(4),
  },
}))

const AdminPanel = ({ eventData, timeState, permissions }) => {
  const classes = useStyles()
  const { setCameraAndMicPermissions } = useAppContext()
  const micOrCameraIsDisabled = Object.values(permissions).indexOf(false) > -1

  const {
    event_users,
    id: eventId,
    start_at: eventStartTime,
    description: eventDescription,
    status,
  } = eventData

  const editFormModal = TransitionModal({
    modalBody: <EventForm eventData={eventData} />,
    button: {
      buttonSize: 'medium',
      buttonText: '✏️ Edit Event',
    },
  })

  const copyEventPromptModal = <ShareEventPromptModal event={eventData} />

  const renderButton = () => {
    let element

    switch (timeState) {
      case 'within 30 mins':
        element = (
          <Grid
            className={classes.adminButtons}
            container
            direction="column"
            alignItems="center"
            justify="space-between"
          >
            <StartPreEventButton
              disabled={micOrCameraIsDisabled}
              within30Mins
              eventStartTime={eventStartTime}
            />
            <Timer adminHeader eventStartTime={eventStartTime} subtitle="Event Starts In:" />
            <div>{editFormModal}</div>
          </Grid>
        )
        break
      case 'go time':
        element = (
          <Grid
            className={classes.adminButtons}
            container
            direction="column"
            alignItems="center"
            justify="space-around"
          >
            <StartPreEventButton
              disabled={micOrCameraIsDisabled}
              eventId={eventId}
              status={status}
            />
            <div>{editFormModal}</div>
          </Grid>
        )
        break
      default:
        element = (
          <Grid
            className={classes.adminButtons}
            container
            direction="column"
            alignItems="center"
            justify="space-around"
          >
            <div>{copyEventPromptModal}</div>
            <div>{editFormModal}</div>
          </Grid>
        )
        break
    }

    return element
  }

  return (
    <>
      {micOrCameraIsDisabled ? (
        <CameraDisabledBanner
          permissions={permissions}
          setCameraAndMicPermissions={setCameraAndMicPermissions}
          admin
        />
      ) : (
        <Grid container direction="row" justify="center" className={classes.cameraTest}>
          <SetupMicAndCameraButton
            permissions={permissions}
            setCameraAndMicPermissions={setCameraAndMicPermissions}
          />
        </Grid>
      )}

      <FloatCardLarge>
        <Grid
          item
          container
          justify="space-around"
          alignItems="center"
          // wrap="nowrap"
          className={classes.topDashboard}
        >
          <Grid
            container
            item
            md={6}
            xs={12}
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Typography className={classes.categoryHeader}>Participants Signed Up</Typography>
            <Typography className={classes.displayNumber}>{event_users.length}</Typography>
          </Grid>
          <Grid
            container
            item
            md={6}
            xs={12}
            direction="column"
            justify="center"
            alignItems="center"
          >
            {renderButton()}
          </Grid>
        </Grid>
        <Grid
          container
          item
          direction="column"
          justify="space-around"
          alignItems="flex-start"
          className={classes.cardBodyContainer}
        >
          {timeState === 'go time' || timeState === 'within 30 mins' ? (
            <Grid
              container
              item
              direction="row"
              wrap="nowrap"
              justify="space-between"
              alignItems="center"
            >
              <ListOfRSVPs />
              <AttendeesList eventId={eventId} timeState={timeState} />
            </Grid>
          ) : (
            <Grid>
              <ListOfRSVPs />
            </Grid>
          )}
        </Grid>
      </FloatCardLarge>
    </>
  )
}

export default AdminPanel
