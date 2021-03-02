import { makeStyles } from '@material-ui/styles'

const useMyProfileStyles = makeStyles((theme) => ({
  // *****************************
  // Edit Profile Sidebar Form
  // *****************************
  myProfileSidebarFormContainer: {
    width: '80%',
    margin: theme.spacing(3, 'auto'),
  },
  tagsContainer: {
    width: '100%',
    marginTop: theme.spacing(5),
  },
  buttonContainer: {
    width: '65%',
    [theme.breakpoints.down('md')]: {
      width: '50%',
    },
    margin: theme.spacing(0, 'auto'),
  },
  cancelButton: {
    margin: theme.spacing(1.5, 0),
    backgroundColor: theme.palette.common.greyButton,
    color: theme.palette.common.ghostWhite,
    '&:hover': {
      backgroundColor: theme.palette.common.greyButtonHover,
    },
  },

  // *****************************
  // My Profile
  // *****************************

  myProfileContainer: {
    marginTop: '150px',
  },

  // *****************************
  // My Profile Sidebar
  // *****************************
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarContainer: {
    width: '125px',
    height: '125px',
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
  linkedInIcon: {
    marginTop: theme.spacing(1),
    fontSize: '32px',
    color: '#3176b0',
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
  shortBio: {
    marginTop: theme.spacing(3),
    width: '75%',
    textAlign: 'center',
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
    position: 'relative',
    width: '125px',
    height: '125px',
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
  },
  // *****************************
  // Sidebar Achievements
  // *****************************

  achievementsContainer: {
    width: '100%',
    margin: theme.spacing(4, 0, 2, 0),
  },
  numbersContainer: {
    marginTop: theme.spacing(3),
  },
  // *****************************
  // Sidebar Tags
  // *****************************
}))

export default useMyProfileStyles
