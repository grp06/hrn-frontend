// @ts-nocheck
import { makeStyles } from '@material-ui/styles'
import { constants } from '../../utils'

const { drawerWidth } = constants
const containerWidth = window.screen.width - drawerWidth

const useEventStyles = makeStyles((theme) => ({
  // *****************************
  //   AboutTheHostCard
  // *****************************
  aboutTheHostCardContainer: {
    position: 'relative',
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: 'auto',
    padding: theme.spacing(3, 5),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3, 3),
    },
  },
  editBioButton: {
    position: 'absolute',
    top: '5%',
    left: 'auto',
    right: 0,
    bottom: 'auto',
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.common.basePink,
    },
  },
  // *****************************
  //   ChangeEventPhotoBanner
  // *****************************
  animateChangeBannerButtonDiv: {
    position: 'absolute',
    top: 15,
    right: '7vw',
    left: 'auto',
    zIndex: 999,
    [theme.breakpoints.down('xs')]: {
      top: 65,
      left: 10,
    },
    borderRadius: '4px',
  },
  bannerSearchForm: {
    position: 'absolute',
    top: 15,
    right: '7vw',
    left: 'auto',
    background: 'rgba(0,0,0,.7)',
    width: '50%',
    margin: theme.spacing(0, 'auto'),
    borderRadius: '4px',
    padding: theme.spacing(2),
    zIndex: 999,
    [theme.breakpoints.down('xs')]: {
      top: 65,
      left: 10,
      width: '85%',
    },
  },
  changeBannerButton: {
    background: 'rgba(0,0,0,.5)',
    '&:hover': {
      background: 'rgba(0,0,0,.7)',
    },
    borderRadius: '4px',
  },
  closeSearchFormButton: {
    position: 'absolute',
    fontWeight: '300',
    top: '2%',
    right: '2%',
    left: 'auto',
    width: '25px',
    height: 'auto',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  searchInput: {
    margin: theme.spacing(0, 0, 2, 0),
  },
  suggestedSearchTermButton: {
    width: 'auto',
    color: theme.palette.common.ghostWhite,
    margin: theme.spacing(0.5),
    textTransform: 'lowercase',
    fontWeight: '300',
  },
  // *****************************
  //   Event
  // *****************************
  eventContentContainer: {
    position: 'relative',
    zIndex: '99',
    width: '75vw',
    maxWidth: '1560px',
    margin: theme.spacing(-20, 'auto', 0, 'auto'),
    paddingBottom: '40px',
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
    },
  },
  podcastContainer: {
    width: '44%',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  whatToExpectContainer: {
    width: '54%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    marginBottom: theme.spacing(3),
  },
  // *****************************
  //   EventPhotoBanner
  // *****************************
  eventBanner: {
    backgroundPosition: '50% 50% !important',
    backgroundSize: 'cover !important',
    height: 'auto',
    marginBottom: '80px',
    minHeight: '55vh',
    width: '100%',
    zIndex: '-3',
  },
  eventPhotoBannerGradient: {
    background:
      'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 58%, rgba(0,212,255,0) 100%)',
    bottom: 'auto',
    height: 'auto',
    minHeight: '55vh',
    position: 'absolute',
    top: '0%',
    width: '100%',
  },
  // *****************************
  //   EventRSVPsCard
  // *****************************
  eventRSVPAvatar: {
    height: '100%',
    width: '100%',
  },
  eventRSVPsCardContainer: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3, 3),
    },
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: 'auto',
    padding: theme.spacing(3, 5),
  },
  seeAllRSVPsButton: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    textTransform: 'none',
  },
  // *****************************
  //   EventTitleAndCTACard
  // *****************************
  ctaCardButtonContainer: {
    [theme.breakpoints.down('md')]: {
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      marginTop: theme.spacing(1),
    },
    marginBottom: theme.spacing(1),
  },
  eventDateTypography: {
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
    margin: theme.spacing(1),
    marginBottom: '10px',
    width: '75%',
  },
  eventTitleAndCTACardContainer: {
    marginBottom: theme.spacing(2),
  },
  shareEventButton: {
    '&:hover': {
      backgroundColor: theme.palette.common.greyHighlight,
    },
    backgroundColor: theme.palette.common.greyButton,
    height: '50px !important',
    marginRight: theme.spacing(1.5),
    width: '50px !important',
  },
  // *****************************
  //   HostAndEventDescCard
  // *****************************
  hostAvatar: {
    width: '100%',
    height: '100%',
  },
  hostAvatarContainer: {
    width: '70px',
    height: '70px',
  },
  hostAndEventDescCardContainer: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: 'auto',
    padding: theme.spacing(3, 5),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3, 3),
    },
  },
  hostAndRSVPContainer: {
    marginBottom: theme.spacing(2),
  },
  hostContainer: {
    height: '70px',
  },
  hostNameAndTitleContainer: {
    width: 'auto',
    height: '100%',
    marginLeft: theme.spacing(2),
    padding: theme.spacing(0.5, 0),
  },
  hostName: {
    margin: '0',
  },
  largeNumber: {
    ...theme.typography.largeNumber,
  },
  onlineAndRSVPedTypography: {
    marginBottom: theme.spacing(1),
  },
  onlineAttendeesNumberContainer: {
    width: 'auto',
    marginLeft: theme.spacing(8),
  },
  rsvpAndOnlineNumberContainer: {
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'flex-start',
      marginTop: theme.spacing(3),
    },
  },
  rsvpedNumberContainer: {
    width: 'auto',
  },
  // *****************************
  //   JoinEventBanner
  // *****************************
  joinEventBannerContainer: {
    backgroundColor: 'rgb(36,37,38,0.7)',
    bottom: 'auto',
    height: 'auto',
    padding: theme.spacing(2),
    position: 'fixed',
    top: '0',
    width: containerWidth,
    zIndex: 999,
  },
  joinEventBannerTextContainer: {
    textAlign: 'center',
    width: 'auto',
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
  yellowText: {
    color: theme.palette.common.sunray,
  },
  // *****************************
  //   PodcastCard
  // *****************************
  podcastCardContainer: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3, 3),
    },
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: '100%',
    padding: theme.spacing(3, 5),
  },
  podcastCardTitle: {
    margin: 0,
  },
  podcastIframe: {
    marginTop: theme.spacing(1.5),
  },
  // *****************************
  //   SetupMicAndCameraButton
  // *****************************
  previewVideo: {
    width: '400px',
    height: 'auto',
    backgroundColor: 'black',
    borderRadius: '4px',
  },
  // *****************************
  //   ShareEventPromptModal
  // *****************************
  eventPromptBody: {
    marginBottom: '20px',
  },
  eventPromptHeader: {
    textAlign: 'center',
  },
  eventPromptParagraph: {
    marginBottom: theme.spacing(1.5),
  },
  shareEventPromptModalDivider: {
    marginBottom: '20px',
    marginTop: '10px',
    width: '25%',
  },
  // *****************************
  //   WhatToExpect
  // *****************************
  stepBodyText: {
    width: '90%',
  },
  stepperBar: {
    margin: theme.spacing(0, 'auto'),
    width: '50%',
  },
  stepperBody: {
    [theme.breakpoints.down('md')]: {
      height: 'auto',
    },
    height: '130px',
    margin: theme.spacing(2, 'auto', 0, 'auto'),
    width: '90%',
  },
  whatToExpectCardContainer: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3, 3),
    },
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: 'auto',
    padding: theme.spacing(3, 5),
  },
}))

export default useEventStyles
