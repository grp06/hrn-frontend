import React, { useEffect, useState } from 'react'

// import { useMutation } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
// import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'

import {
  EventBreakdownStepper,
  EventCountdown,
  SetupMicAndCameraButton,
  ShareEventPromptModal,
} from '.'
import { FloatCardLarge, CameraDisabledBanner } from '../../common'
import { useEventContext, useUserContext } from '../../context'
import { insertEventUser, deleteEventUser } from '../../gql/mutations'

const useStyles = makeStyles((theme) => ({
  cameraTest: {
    marginBottom: theme.spacing(4),
  },
  centerText: {
    textAlign: 'center',
  },
  ctaButtonContainer: {
    minHeight: '125px',
    height: 'auto',
  },
  partyEmoji: {
    marginLeft: theme.spacing(1),
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    top: 'auto',
  },
  topDashboard: {
    width: '100%',
    paddingTop: '40px',
    paddingBottom: '40px',
    borderStyle: 'none none solid',
    borderWidth: '1px',
    borderColor: theme.palette.common.greyBorder,
    borderRadius: '4px 4px 0px 0px',
    backgroundColor: theme.palette.common.greyHighlight,
  },
}))

const EventNotRSVP = () => {
  const classes = useStyles()
  return (
    <FloatCardLarge>
      <Grid
        item
        container
        justify="space-around"
        alignItems="center"
        // wrap="nowrap"
        className={classes.topDashboard}
      >
        <Typography variant="h4">Sorry, this event is over.</Typography>
      </Grid>
    </FloatCardLarge>
  )
}

export default EventNotRSVP
