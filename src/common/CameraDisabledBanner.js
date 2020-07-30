import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { FloatCardLarge } from '.'
import { SetupMicAndCameraButton } from '../pages/Event'

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
  },
  typographyContainer: {
    marginBottom: theme.spacing(3),
  },
  centerText: {
    textAlign: 'center',
  },
  emoji: {
    marginLeft: theme.spacing(1),
    fontSize: '40px',
  },
}))

const CameraDisabledBanner = ({ setCameraAndMicPermissions, admin, permissions }) => {
  const classes = useStyles()

  return (
    <FloatCardLarge id="crikey">
      <Grid item container justify="center" alignItems="center" className={classes.topDashboard}>
        <Grid container item md={6} xs={12} direction="column" justify="center" alignItems="center">
          <div className={classes.typographyContainer}>
            <Typography variant="h5" className={classes.centerText}>
              Crikey
              <span className={classes.emoji} role="img" aria-label="woozy face emoji">
                🥴
              </span>
            </Typography>
            <Typography variant="h5" className={classes.centerText}>
              Your Camera is off
            </Typography>
            <Typography variant="h5" className={classes.centerText}>
              It must be enabled to {admin ? 'start' : 'participate in'} the event
            </Typography>
          </div>
          <SetupMicAndCameraButton
            permissions={permissions}
            setCameraAndMicPermissions={setCameraAndMicPermissions}
          />
        </Grid>
      </Grid>
    </FloatCardLarge>
  )
}

export default CameraDisabledBanner
