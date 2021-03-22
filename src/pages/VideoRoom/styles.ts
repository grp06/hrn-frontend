//@ts-nocheck
import { makeStyles } from '@material-ui/styles'
import ConfettiDoodlesSmallerScale from '../../assets/ConfettiDoodlesSmallerScale.svg'
import { constants } from '../../utils'

const { bottomNavBarHeight } = constants

const useVideoRoomStyles = makeStyles((theme) => ({
  // *****************************
  //   Add Friend Button
  // *****************************
  addFriendButton: {
    margin: theme.spacing(1, 0),
    backgroundColor: theme.palette.common.sunray,
    '&:hover': {
      backgroundColor: '#FCD08C',
    },
    color: 'black',
  },
  // *****************************
  //   Connecting to someone
  // *****************************
  CTAButton: {
    marginTop: theme.spacing(1.5),
  },
  inEventScreenText: {
    ...theme.typography.inEventScreenText,
  },
  waitingRoom: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    // background: '#111',
    backgroundImage: `url(${ConfettiDoodlesSmallerScale})`,
    backgroundRepeat: 'repeat',
    backgroundSize: 'auto',
    height: '100vh',
    alignItems: 'center',
    flexDirection: 'column',
  },
  dancingMan: {
    fontSize: '50px',
  },

  // *****************************
  //   Connection Issues Modal
  // *****************************
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    border: '2px solid #8C57DB',
    boxShadow: '4px 4px 0 #8C57DB',
    width: '55vw',
    minWidth: '20vw',
    height: 'auto',
    padding: '40px',
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
    },
  },
  modalBody: {
    ...theme.typography.modalBody,
    marginBottom: '20px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '50%',
    [theme.breakpoints.down('md')]: {
      width: '80%',
    },
  },
  acceptButton: {
    margin: theme.spacing(1.5, 0),
  },

  // *****************************
  //   Host Event Controls Card
  // *****************************
  container: {
    position: 'relative',
    zIndex: 9999,
    width: '250px',
    height: 'auto',
    borderRadius: '4px',
    backgroundColor: theme.palette.common.greyCard,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  onlineUsersText: {
    color: theme.palette.common.sunray,
    textAlign: 'center',
    marginBottom: theme.spacing(1),
  },
  // *****************************
  //   IcebreakerQuestionCard
  // *****************************
  icebreakerQuestionCard: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: 'auto',
    margin: theme.spacing(1, 0),
    padding: theme.spacing(2),
    width: '100%',
  },
  mysteryQuestionBox: {
    alignItems: 'center',
    backgroundColor: theme.palette.common.basePink,
    border: '2px solid #000000',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    height: '40px',
    justifyContent: 'center',
    width: '40px',
  },
  questionContainer: {
    backgroundColor: theme.palette.common.greyHover,
    borderRadius: '4px',
    marginLeft: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    width: '75%',
  },
  questionDividerLine: {
    backgroundColor: theme.palette.common.greySubtitle,
    height: '1px',
    margin: theme.spacing(0.25, 0, 0.75, 0),
    width: '15%',
  },
  // *****************************
  //   In Video Bottom Control Panel
  // *****************************
  activeButton: {
    borderRadius: '4px',
    backgroundColor: '#41444A !important',
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
  iconButton: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    '&:hover': {
      borderRadius: '4px',
      backgroundColor: '#41444A',
    },
  },
  inVideoBottomControlPanelContainer: {
    position: 'fixed',
    zIndex: 3,
    width: '100%',
    height: bottomNavBarHeight,
    top: 'auto',
    bottom: '0%',
    padding: theme.spacing(2, 4),
    paddingRight: '6vw',
    backgroundColor: theme.palette.common.grey10,
  },
  // *****************************
  //   More Actions Button
  // *****************************
  fabButton: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    '&:hover': {
      borderRadius: '4px',
      backgroundColor: '#41444A',
    },
  },
  moreActionsButtonContainer: {
    height: 380,
    transform: 'translateZ(0px)',
    flexGrow: 1,
  },
  speedDial: {
    position: 'absolute',
    top: -20,
    minHeight: '40px',
  },

  // *****************************
  //   Partner Tags List
  // *****************************
  partnerTagsListContainer: {
    margin: theme.spacing(1.5, 'auto', 0, 'auto'),
    padding: theme.spacing(0, 1),
  },
  // *****************************
  //   Post Chat Rating
  // *****************************

  emoji: {
    fontSize: '50px',
    padding: theme.spacing(0, 2),
  },
  pageContainer: {
    backgroundImage: `url(${ConfettiDoodlesSmallerScale})`,
    backgroundRepeat: 'repeat',
    backgroundSize: 'auto',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    alignItems: 'center',
    flexDirection: 'column',
  },
  ratingContainer: {
    margin: theme.spacing(0, 'auto'),
    width: '70%',
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
    },
  },
  postChatRatingButtonContainer: {
    width: '60%',
    margin: theme.spacing(5, 0, 0, 0),
    [theme.breakpoints.down('md')]: {
      width: '80%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  postChatRatingFabButton: {
    width: '120px',
    height: '120px',
    lineHeight: 1.25,
    '&:hover': {
      backgroundColor: theme.palette.common.basePurple,
      color: theme.palette.common.ghostWhite,
    },
    '&:hover .MuiFab-label .MuiGrid-root .MuiTypography-subtitle2': {
      color: theme.palette.common.ghostWhite,
      fontWeight: '700',
    },
  },
  fabButtonGrid: {
    height: '75%',
  },
  fabText: {
    color: theme.palette.common.basePurple,
    fontWeight: '700',
  },
  // *****************************
  //   Report User Modal
  // *****************************

  cancelButton: {
    margin: theme.spacing(1.5, 0),
    backgroundColor: theme.palette.common.greyButton,
    color: theme.palette.common.ghostWhite,
    '&:hover': {
      backgroundColor: theme.palette.common.greyButtonHover,
    },
  },
  // *****************************
  //   Video Room Sidebar
  // *****************************
  videoRoomSidebarContainer: {
    position: 'absolute',
    top: '3%',
    right: 'auto',
    bottom: 'auto',
    left: '1%',
    width: '250px',
    zIndex: 99999,
  },
  // *****************************
  //   Video Room
  // *****************************
  videoWrapper: {
    backgroundImage: `url(${ConfettiDoodlesSmallerScale})`,
    backgroundRepeat: 'repeat',
    backgroundSize: 'auto',
  },
  screenOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    width: '100vw',
    height: '100vh',
  },
  mainVid: {
    width: '100%',
    display: 'flex',
    '& video': {
      width: '100vw',
      height: '100vh',
    },
  },
  myVideo: {
    width: '225px',
    position: 'absolute',
    top: '3%',
    right: '1%',
    left: 'auto',
    bottom: 'auto',
    zIndex: 99,
    '& video': {
      borderRadius: 4,
      width: '225px',
    },
  },

  cameraDisabledWrapper: {
    height: '100vh',
  },
  // *****************************
  //   Round And Partner Card
  // *****************************
  roundAndPartnerCardContainer: {
    position: 'relative',
    bottom: '0%',
    display: 'block',
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
    backgroundColor: theme.palette.common.greyCard,
    padding: theme.spacing(1, 0),
  },
  partnerName: {
    textAlign: 'center',
    marginBottom: '0',
  },
  roundNumberText: {
    textAlign: 'center',
  },

  // *****************************
  //   Round Progress Bar
  // *****************************
  animatedCountdown: {
    position: 'fixed',
    zIndex: 9999999,
    height: '500px',
    width: '500px',
    borderRadius: 360,
    backgroundColor: theme.palette.common.basePurple,
    margin: 'auto',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  animatedBackdrop: {
    position: 'fixed',
    zIndex: 9999988,
    height: '100vh',
    width: '100vw',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'black',
    opacity: 0,
  },
  countdownNumber: {
    fontSize: '20rem',
    textAlign: 'center',
    color: theme.palette.common.ghostWhite,
  },
  roundProgressBarContainer: {
    width: '100%',
    // height: 20,
    position: 'fixed',
    bottom: bottomNavBarHeight,
  },

  // *****************************
  //   Set up Mic and Camera Modal
  // *****************************
  previewVideo: {
    width: '400px',
    height: 'auto',
    backgroundColor: 'black',
    borderRadius: '4px',
  },
}))

export default useVideoRoomStyles
