import React from 'react'
import { Avatar, Grid, TextField } from '@material-ui/core'
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
  },
  cancelButton: {
    margin: theme.spacing(1.5, 0),
    backgroundColor: theme.palette.common.greyButton,
    color: theme.palette.common.ghostWhite,
    '&:hover': {
      backgroundColor: theme.palette.common.greyButtonHover,
    },
  },
  form: {
    boxSizing: 'border-box',
    width: '90%',
    display: 'flex',
    flexFlow: 'column',
    backgroundColor: theme.palette.common.greyCard,
    padding: 17,
    '& .MuiFormControl-root:not(:first-child)': {
      marginTop: '16px',
    },
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(0, 0, 0, .7)',
    color: '#fff',
    opacity: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  uploadImageText: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    textAlign: 'center',
  },
  wrap: {
    backgroundColor: theme.palette.common.basePurple,
    borderRadius: '180px',
    position: 'relative',
    width: 88,
    height: 88,
    margin: theme.spacing(4, 0),
    cursor: 'pointer',
  },
}))

const CelebProfilePreview = ({ celeb }) => {
  const classes = useStyles()
  const { cash_app, email, name, profile_pic_url, venmo } = celeb

  const readonly = {
    readOnly: true,
  }

  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <div className={classes.wrap}>
        <Avatar className={classes.avatarContainer}>
          {profile_pic_url ? (
            <img alt="Profile" className={classes.avatar} src={profile_pic_url} />
          ) : (
            <img alt="company-logo" className={classes.avatarLogo} src={logo} />
          )}
        </Avatar>
      </div>
      <form className={classes.form}>
        <TextField label="Full name" value={name} InputProps={readonly} />
        <TextField label="Email" value={email} InputProps={readonly} />
        <TextField label="Venmo" value={venmo} InputProps={readonly} />
        <TextField label="Cash App" value={cash_app} InputProps={readonly} />
      </form>
    </Grid>
  )
}

export default CelebProfilePreview
