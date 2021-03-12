// @ts-nocheck
import { makeStyles } from '@material-ui/styles'

const useCommonComponentStyles = makeStyles((theme) => ({
  // *****************************
  //   EventCard
  // *****************************
  eventCardContainer: {
    borderRadius: '4px',
    position: 'relative',
    width: '100%',
  },
  eventCardContentContainer: {
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
    },
    borderRadius: '4px',
    cursor: 'pointer',
    height: 'auto',
    padding: '20px',
    width: '100%',
  },
  eventCardDateTypography: {
    [theme.breakpoints.down('sm')]: {
      width: '80%',
    },
    margin: theme.spacing(1),
    marginBottom: '10px',
    width: '75%',
  },
  eventCardHostAvatar: {
    height: '100%',
    width: '100%',
  },
  eventCardHostAvatarContainer: {
    height: '55px',
    width: '55px',
  },
  eventCardImage: {
    [theme.breakpoints.down('md')]: {
      height: '200px',
    },
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    borderRadius: '4px 0px 0px 4px',
    cursor: 'pointer',
    height: 'auto',
    width: '100%',
  },
  eventEndedOverlay: {
    backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0.5))',
    bottom: '0%',
    height: '100%',
    left: '0%',
    position: 'absolute',
    right: '0%',
    top: '0%',
    width: '100%',
    zIndex: 9,
  },
  eventOverButton: {
    marginTop: theme.spacing(2),
    position: 'relative',
    zIndex: 10,
  },
  hostName: {
    margin: '0',
  },
  hostNameAndTitleContainer: {
    height: '100%',
    marginLeft: theme.spacing(2),
    padding: theme.spacing(0.5, 0),
    width: 'auto',
  },
  liveGlowContaner: {
    borderRadius: '4px',
  },
  liveLogo: {
    backgroundColor: theme.palette.common.basePurple,
    borderRadius: '4px',
    bottom: 'auto',
    color: theme.palette.common.ghostWhite,
    fontWeight: 'bold',
    height: 'auto',
    left: 'auto',
    position: 'absolute',
    right: '2%',
    textAlign: 'center',
    top: '3%',
    width: '60px',
  },
  twoSidedLogo: {
    backgroundColor: theme.palette.common.basePink,
    borderRadius: '4px',
    color: theme.palette.common.bodyBlack,
    fontWeight: 'bold',
    height: 'auto',
    margin: theme.spacing(0.5, 0),
    padding: theme.spacing(0, 0.5),
    textAlign: 'center',
    width: '165px',
  },
  // *****************************
  //   TransitionModal
  // *****************************
  modalAcceptButton: {
    margin: theme.spacing(1.5, 0),
  },
  modalBody: {
    ...theme.typography.modalBody,
    marginBottom: '20px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
  },
  modalButtonContainer: {
    [theme.breakpoints.down('md')]: {
      width: '90%',
    },
    width: '75%',
  },
  modalCancelButton: {
    '&:hover': {
      backgroundColor: theme.palette.common.greyButtonHover,
    },
    backgroundColor: theme.palette.common.greyButton,
    color: theme.palette.common.ghostWhite,
    margin: theme.spacing(1.5, 0),
  },
  modalContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPaper: {
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
    },
    backgroundColor: theme.palette.common.greyCard,
    border: '2px solid #8C57DB',
    borderRadius: '4px',
    boxShadow: '4px 4px 0 #8C57DB',
    height: 'auto',
    minWidth: '20vw',
    padding: '40px',
    width: '55vw',
  },
}))

export default useCommonComponentStyles
