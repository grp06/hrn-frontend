import React from 'react'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import { useAppContext } from '../../context/useAppContext'

import { HostDrawerContent, UserDrawerContent } from '.'
import logo from '../../assets/logoWhite.svg'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  logo: {
    height: '2.85em',
    [theme.breakpoints.down('md')]: {
      height: '2.5em',
    },
  },
  toolbar: theme.mixins.toolbar,
  topOfDrawer: {
    height: '100%',
  },
  userName: {
    color: theme.palette.common.ghostWhiteBody,
    '&:hover': {
      color: theme.palette.common.sunray,
    },
  },
}))

const DrawerContent = () => {
  const { user } = useAppContext()
  const { role } = user
  const classes = useStyles()
  return (
    <>
      <div className={classes.toolbar}>
        <Grid container justify="center" alignItems="center" className={classes.topOfDrawer}>
          <Button component={Link} to="/" disableRipple>
            <img alt="company-logo" className={classes.logo} src={logo} />
          </Button>
        </Grid>
      </div>
      <Divider />
      <UserDrawerContent />
      {role === 'host' && <HostDrawerContent />}

      {/* <HostEventControlsMenu event={event} user={user} /> */}
      {/* {eventStatus === 'pre-event' && (
              <MenuItem className={classes.menuItem}>{handleStartEventModal}</MenuItem>
            )} */}
      {/* <Grid container alignItems="center">
        <div className={classes.marginRight}>
          <StartEventButton event={event} user={user} />
        </div>
        {renderCurrentEventStatus()}
      </Grid>
      <div className={classes.grow} />
      {renderHeaderElements()} */}
    </>
  )
}

export default DrawerContent
