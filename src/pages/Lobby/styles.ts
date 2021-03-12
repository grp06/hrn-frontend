// @ts-nocheck
import { makeStyles } from '@material-ui/styles'
import cameraBlocked from '../../assets/cameraBlocked.png'
import ConfettiDoodlesSmallerScale from '../../assets/ConfettiDoodlesSmallerScale.svg'
import { constants } from '../../utils'
const { bottomNavBarHeight } = constants

const useLobbyStyles = makeStyles((theme) => ({
  // *****************************
  //   COMMON
  // *****************************
  eventAndLobbyContentCard: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3, 3),
    },
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: 'auto',
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3, 5),
    width: '100%',
  },
  eventAndLobbyContentCardTitle: {
    marginBottom: theme.spacing(0.5),
  },
  // *****************************
  //   BottomControlPanel
  // *****************************
  activeBottomControlButton: {
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
    backgroundColor: '#41444A !important',
    borderRadius: '4px',
  },
  bottomControlPanelContainer: {
    backgroundColor: theme.palette.common.grey10,
    bottom: '0%',
    height: bottomNavBarHeight,
    padding: theme.spacing(2, 4),
    position: 'fixed',
    top: 'auto',
    width: '100%',
    zIndex: 999,
  },
  iconButton: {
    '&:hover': {
      backgroundColor: '#41444A',
      borderRadius: '4px',
    },
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  settingsAndChatGrid: {
    paddingRight: '6vw',
  },
  // *****************************
  //   CameraAndMicSetupScreen
  // *****************************
  cameraAndMicSetupScreenContainer: {
    backgroundImage: `url(${ConfettiDoodlesSmallerScale})`,
    backgroundRepeat: 'repeat',
    backgroundSize: 'auto',
    height: '100vh',
    position: 'absolute',
    width: '100vw',
  },
  previewVideo: {
    backgroundColor: 'black',
    borderRadius: '4px',
    height: 'auto',
    width: '100%',
  },
  videoAndMicSelectionContainer: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: 'auto',
    margin: 'auto',
    padding: theme.spacing(3),
    width: '85%',
  },
  // *****************************
  //   EventCountdown
  // *****************************
  eventCountdownContainer: {
    backgroundColor: 'rgb(36,37,38,0.7)',
    bottom: 'auto',
    height: 'auto',
    padding: theme.spacing(2),
    position: 'fixed',
    top: '0',
    width: '100%',
    zIndex: 999,
  },
  linearProgressRoot: {
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 'auto',
    width: '100%',
  },
  time: {
    color: theme.palette.common.ghostWhite,
    fontFamily: 'Muli',
    fontSize: '2.25rem',
    fontWeight: '700',
    marginRight: theme.spacing(1),
  },
  // *****************************
  //   LobbyContent
  // *****************************
  lobbyContentContainer: {
    margin: theme.spacing(-20, 'auto', 12, 'auto'),
    maxWidth: '1560px',
    position: 'relative',
    width: '85%',
    zIndex: '99',
  },
  narrowEventAndLobbyContentGrid: {
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    width: '44%',
  },
  wideEventAndLobbyContentGrid: {
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    width: '54%',
  },
  // *****************************
  //   NextRoundIn
  // *****************************
  nextRoundInContainer: {
    position: 'fixed',
    zIndex: 999,
    bottom: 'auto',
    width: '100%',
    height: 'auto',
    top: '0',
    backgroundColor: 'rgb(36,37,38,0.7)',
    padding: theme.spacing(2),
  },
  normalText: {
    fontWeight: '200',
    color: theme.palette.common.ghostWhiteDark,
  },
  // *****************************
  //   OnlineAttendeesCard
  // *****************************
  onlineAttendeeAvatar: {
    height: '100%',
    width: '100%',
  },
  seeAllButton: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    textTransform: 'none',
  },
  side_aLabel: {
    fontWeight: 700,
    margin: theme.spacing(0.5, 0, 1, 0),
  },
  side_bLabel: {
    fontWeight: 700,
    margin: theme.spacing(2, 0, 1, 0),
  },
  // *****************************
  //   SetupMicAndCamera
  // *****************************
  blockedText: {
    bottom: '40%',
    position: 'fixed',
    width: '100%',
  },
  cameraBlocked: {
    background: `url("${cameraBlocked}")`,
    backgroundPosition: 'top center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '50%',
    height: '100vh',
    left: 0,
    position: 'fixed',
    top: 0,
    width: '100%',
  },
  joinEventButton: {
    marginTop: theme.spacing(4),
    width: '100%',
  },
  permissionsContainer: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
    },
    margin: 'auto',
    width: '95%',
  },
  permissionsContent: {
    margin: 'auto',
    width: '90%',
  },
  selectInputBox: {
    margin: theme.spacing(0.5, 0),
  },
  setupMicAndCameraModalText: {
    margin: theme.spacing(2.5, 'auto', 0, 'auto'),
    textAlign: 'center',
    width: 'auto',
  },
  youLookGoodContainer: {
    marginBottom: theme.spacing(4),
  },
  // *****************************
  //   SittingOutCard
  //   UserEventStatusCard
  // *****************************
  sittingOutAndStatusMessageGrid: {
    marginTop: theme.spacing(3),
  },
}))

export default useLobbyStyles
