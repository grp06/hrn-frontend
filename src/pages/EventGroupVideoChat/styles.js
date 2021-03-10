import { makeStyles } from '@material-ui/styles'
import ConfettiDoodlesSmallerScale from '../../assets/ConfettiDoodlesSmallerScale.svg'
import PersonIcon from '../../assets/greyPerson.svg'
import MicOffIcon from '../../assets/micOff.svg'

const useEventGroupVideoChatStyles = makeStyles((theme) => ({
  // *****************************
  //   EventGroupVideoChat
  // *****************************
  attendeesNameContainer: {
    alignItems: 'center',
    backgroundColor: 'rgb(36,37,38,0.7)',
    borderRadius: '4px',
    bottom: '1%',
    display: 'flex',
    height: '25px',
    justifyContent: 'space-between',
    left: '1%',
    padding: theme.spacing(0.5, 1),
    position: 'absolute',
    right: 'auto',
    top: 'auto',
    width: 'auto',
    zIndex: 9,
  },
  attendeesNameDiv: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  attendeesNameInVideo: {
    color: theme.palette.common.ghostWhite,
    fontFamily: 'Muli',
    fontSize: '1.25rem',
    fontWeight: '400',
    margin: 0,
  },
  attendeeVideoBox: {
    '& video': {
      height: '100%',
      objectFit: 'cover',
      width: '100%',
    },
    backgroundColor: theme.palette.common.greyCard,
    backgroundImage: `url(${PersonIcon})`,
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    borderRadius: '4px',
    margin: theme.spacing(0.5),
    position: 'relative',
  },
  hostTag: {
    color: theme.palette.common.basePink,
    fontFamily: 'Muli',
    fontSize: '1.25rem',
    fontWeight: 700,
    marginRight: '5px',
  },
  micOffIconDiv: {
    backgroundImage: `url(${MicOffIcon})`,
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    display: 'none',
    height: '25px',
    marginLeft: '4px',
    marginRight: '-4px',
    width: '25px',
  },
  videoBox: {
    borderRadius: '4px',
    height: '90vh',
    margin: theme.spacing(0, 'auto'),
    overflowY: 'scroll',
    padding: theme.spacing(3),
    width: '95%',
    backgroundImage: `url(${ConfettiDoodlesSmallerScale})`,
    backgroundRepeat: 'repeat',
    backgroundSize: 'auto',
  },
  // *****************************
  //   GroupVideoChatBottomPanel
  // *****************************
  activeChatButton: {
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
    backgroundColor: '#41444A !important',
    borderRadius: '4px',
  },
  bottomControlPanelContainer: {
    backgroundColor: theme.palette.common.grey10,
    bottom: '0%',
    height: '80px',
    padding: theme.spacing(2, 4),
    position: 'fixed',
    top: 'auto',
    width: '100%',
    zIndex: 999,
  },
  greySquareIconButton: {
    '&:hover': {
      backgroundColor: '#41444A',
      borderRadius: '4px',
    },
    backgroundColor: 'transparent',
    borderRadius: '4px',
    margin: theme.spacing(0, 1),
  },
  settingsAndChatGrid: {
    paddingRight: '6vw',
  },
}))

export default useEventGroupVideoChatStyles
