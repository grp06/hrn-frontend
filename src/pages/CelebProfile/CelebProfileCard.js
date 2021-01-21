import React from 'react'
import { useHistory } from 'react-router-dom'
import { Avatar, Button, Grid, TextField } from '@material-ui/core'
import logo from '../../assets/logoWhite.svg'
import FeatherIcon from 'feather-icons-react'

import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: '75%',
    height: '75%',
  },
  avatarContainer: {
    backgroundColor: 'transparent',
    width: '125px',
    height: '125px',
  },
  buttonContainer: {
    width: '50%',
    [theme.breakpoints.down('md')]: {
      width: '50%',
    },
  },
  cancelButton: {
    margin: theme.spacing(1.5, 0),
    backgroundColor: theme.palette.common.greyButton,
    color: theme.palette.common.ghostWhite,
    '&:hover': {
      backgroundColor: theme.palette.common.greyButtonHover,
    },
  },
  editProfileButton: {
    margin: theme.spacing(2, 0),
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
    width: '125px',
    height: '125px',
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
  },
  icon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    transform: 'translateX(100%)',
  },
}))

const CelebProfilePreview = ({ celeb, setIsEditing }) => {
  const classes = useStyles()
  const history = useHistory()
  const { cash_app, email, name, profile_pic_url, venmo, password } = celeb
  const eventIdInLS = localStorage.getItem('eventId')

  const readonly = {
    readOnly: true,
  }

  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <div className={classes.wrap}>
        <Avatar className={classes.avatarContainer}>
          <img alt="company-logo" className={classes.avatar} src={profile_pic_url || logo} />
        </Avatar>
        <FeatherIcon
          className={classes.icon}
          icon="edit"
          stroke="#f4f6fa"
          size="22"
          onClick={() => setIsEditing(true)}
        />
      </div>
      <form className={classes.form}>
        <TextField label="Full name" value={name} InputProps={readonly} />
        <TextField label="Email" value={email} InputProps={readonly} />
        <TextField label="Password" type="password" value={password} InputProps={readonly} />
        <TextField label="Venmo" value={venmo} InputProps={readonly} />
        <TextField label="Cash App" value={cash_app} InputProps={readonly} />
      </form>
      <Grid
        container
        justify="space-around"
        alignItems="center"
        className={classes.buttonContainer}
      >
        <Button
          variant="contained"
          color="secondary"
          disabled={!eventIdInLS}
          className={classes.editProfileButton}
          onClick={() => history.push(`/events/${eventIdInLS}`)}
        >
          Back to Event
        </Button>
      </Grid>
    </Grid>
  )
}

export default CelebProfilePreview
