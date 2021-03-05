import { makeStyles } from '@material-ui/styles'
import blurryBackground from '../../assets/blurryBackground.png'

const useMyConnectionsStyles = makeStyles((theme) => ({
  // *****************************
  //   ConnectionCard
  // *****************************
  addFriendButtonContainer: {
    width: '160px',
  },
  circleButton: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
    backgroundColor: 'transparent',
    border: `2px solid ${theme.palette.common.basePink}`,
    height: '35px',
    marginRight: theme.spacing(2),
    width: '35px',
  },
  cityNameEmailGrid: {
    height: '100%',
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  connectionAvatar: {
    height: '100%',
    width: '100%',
  },
  connectionAvatarContainer: {
    height: '100px',
    width: '100px',
  },
  connectionAvatarGridContainer: {
    height: '110px',
  },
  connectionCardButtonContainer: {
    paddingTop: theme.spacing(1),
  },
  connectionCardContainer: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
    },
    backgroundColor: theme.palette.common.grey10,
    borderRadius: '4px',
    bottom: '0%',
    display: 'block',
    height: 'auto',
    marginBottom: '40px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: theme.spacing(3, 5),
    position: 'relative',
    width: '100%',
  },
  connectionContentContainer: {
    margin: theme.spacing(2, 0),
  },
  shortBioDesc: {
    margin: theme.spacing(2, 0, 1, 0),
  },
  tagsContainer: {
    marginLeft: '-5px',
    marginTop: theme.spacing(0.5),
  },
  // *****************************
  //   MyConnections
  // *****************************
  myConnectionsContainer: {
    [theme.breakpoints.down('sm')]: {
      width: '500px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '85vw',
    },
    margin: theme.spacing(0, 'auto'),
    width: '800px',
  },
  myConnectionsPageBanner: {
    backgroundImage: `url(${blurryBackground})`,
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    height: '30vh',
    marginBottom: '40px',
    width: '100%',
  },
  nullDataContainer: {
    padding: theme.spacing(5),
  },
  nullDataHeader: {
    marginBottom: theme.spacing(1),
    textAlign: 'center',
  },
  nullDataSub: {
    textAlign: 'center',
  },
  pageBannerContentContainer: {
    margin: theme.spacing(0, 'auto', 1.5, 'auto'),
    width: '70%',
  },
  toggleButtonActive: {
    '&.Mui-selected': {
      '&:hover': {
        backgroundColor: 'transparent',
      },
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: `2px solid ${theme.palette.common.basePink}`,
      borderRadius: 0,
      color: theme.palette.common.basePink,
    },
    width: '125px',
  },
  toggleButtonGroup: {
    margin: theme.spacing(0, 0, 12, 0),
  },
  toggleButtonInactive: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
    border: 'none',
    borderBottom: '2px solid #3e4042',
    borderRadius: 0,
    color: theme.palette.common.ghostWhite,
    width: '125px',
  },
  toggleGrid: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '70%',
  },
}))

export default useMyConnectionsStyles
