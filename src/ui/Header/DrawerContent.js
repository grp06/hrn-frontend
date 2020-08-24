import React from 'react'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import { useAppContext, useUserContext } from '../../context'

import { HostDrawerContent, UserDrawerContent, SettingsDrawerContent } from '.'
import logo from '../../assets/logoWhite.svg'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  logo: {
    padding: theme.spacing(1.75, 0),
    height: '2.65em',
    [theme.breakpoints.down('md')]: {
      height: '2.5em',
    },
  },
  privacyPolicyLink: {
    fontFamily: 'Muli',
    textAlign: 'center',
    textDecoration: 'none',
    margin: theme.spacing('auto', 0, 2, 0),
    fontSize: '0.8rem',
    color: theme.palette.common.ghostWhiteBody,
    '&:hover': {
      color: theme.palette.common.sunray,
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
  const classes = useStyles()
  const { appLoading } = useAppContext()
  const { user, resetUser } = useUserContext()
  const { name, role, id: userId } = user

  console.log('userId ->', userId)
  console.log('apploading ->', appLoading)
  return (
    !appLoading && (
      <>
        <div className={classes.toolbar}>
          <Grid container justify="center" alignItems="center" className={classes.topOfDrawer}>
            <Button component={Link} to="/" disableRipple>
              <img alt="company-logo" className={classes.logo} src={logo} />
            </Button>
          </Grid>
        </div>
        <Divider />
        <UserDrawerContent userId={userId} userName={name} />
        {role === 'host' && <HostDrawerContent />}
        <SettingsDrawerContent resetUser={resetUser} userId={userId} />
        <Link to="/privacy-policy" className={classes.privacyPolicyLink}>
          Privacy Policy
        </Link>
      </>
    )
  )
}

export default DrawerContent
