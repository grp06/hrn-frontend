import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { FloatCardLarge } from '.'
import SetupMicAndCameraButton from './SetupMicAndCameraButton'

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
  categoryHeader: {
    ...theme.typography.h2,
    color: theme.palette.common.ghostWhite,
  },
}))

const CameraDisabledBanner = ({ setCameraAndMicPermissions, admin, permissions }) => {
  const classes = useStyles()

  return (
    <FloatCardLarge id="crikey">
      <Grid item container justify="center" alignItems="center" className={classes.topDashboard}>
        <Grid container item md={6} xs={12} direction="column" justify="center" alignItems="center">
          <div className={classes.categoryHeader}>
            <Typography variant="h2" style={{ textAlign: 'center', display: 'block' }}>
              Crikey
              <span
                style={{ marginLeft: 10, fontSize: 40 }}
                role="img"
                aria-label="woozy face emoji"
              >
                🥴
              </span>
            </Typography>
            <Typography style={{ textAlign: 'center' }} variant="h2">
              Your Camera seems to be disabled
            </Typography>
            {admin && (
              <Typography style={{ textAlign: 'center' }} variant="h2">
                Camera must be enabled to start the event
              </Typography>
            )}
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
