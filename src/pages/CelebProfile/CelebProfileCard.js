import React from 'react'
import FeatherIcon from 'feather-icons-react'
import { useHistory } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import logo from '../../assets/logoWhite.svg'
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
  fileForm: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
}))

const CelebProfilePreview = ({ celeb, setCelebProfileContent }) => {
  const classes = useStyles()
  const history = useHistory()
  const { cash_app, email, name, profile_pic_url, venmo } = celeb
  const eventIdInLS = localStorage.getItem('eventId')
  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <div className={classes.wrap}>
        <Avatar className={classes.avatarContainer}>
          <img alt="company-logo" className={classes.avatar} src={profile_pic_url || logo} />
        </Avatar>
        <FeatherIcon
          icon="edit-2"
          stroke="#f4f6fa"
          size="22"
          onClick={() => setCelebProfileContent('edit-celeb-profile')}
        />
      </div>
      <Typography variant="h3">{name}</Typography>
      <Typography variant="subtitle1">{cash_app}</Typography>
      <Typography variant="subtitle1">{venmo}</Typography>
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
