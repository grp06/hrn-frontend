// @ts-nocheck
import { makeStyles, Styles } from '@material-ui/styles'
import { default as appTheme } from '../../ui/theme'
import PersonIcon from '../../assets/greyPerson.svg'
import MicOffIcon from '../../assets/micOff.svg'
import { constants } from '../../utils'

const useNewLobbyStyles = makeStyles((theme) => ({
  // *****************************
  //   UserVideoCard
  // *****************************
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
  userNameAndMicDiv: {
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
  userVideoCard: {
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
    display: 'none',
    margin: theme.spacing(0.5),
    position: 'relative',
  },

  // *****************************
  //   Lobby
  // *****************************

  lobby: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    background: theme.palette.common.greenCampfire,
  },
}))

const { bottomNavBarHeight } = constants
export const createChatBoxStyles = makeStyles(
  (theme: any): Styles<typeof appTheme, {}, never> => ({
    chatBoxTitle: {
      padding: theme.spacing(1.5, 0),
      fontFamily: 'Muli',
      fontWeight: 700,
      color: theme.palette.common.basePink,
    },
    chatContainer: {
      position: 'relative',
      display: 'block',
      width: '25vw',
      height: '100vh',
      borderRadius: '4px',
      background: 'transparent',
      zIndex: '999',
      [theme.breakpoints.down('md')]: {
        width: '30vw',
      },
      [theme.breakpoints.down('xs')]: {
        width: '85vw',
      },
      '& ::-webkit-scrollbar': {
        display: 'none',
      },
    },
    chatList: {
      flexDirection: 'column',
      height: '83%',
      overflow: 'auto',
      padding: theme.spacing(0, 1),
    },
    hiRightNowTeamName: {
      color: theme.palette.common.sunray,
      fontWeight: 700,
    },
    hostTag: {
      marginLeft: theme.spacing(0.5),
      color: theme.palette.common.basePink,
      fontWeight: 700,
      fontSize: '.6rem',
    },
    inputContainer: {
      background: 'transparent',
      boxShadow:
        'inset -5px -5px 15px rgba(236, 255, 247, 0.55), inset 5px 5px 15px rgba(7, 106, 82, 0.15)',
      borderRadius: '26px',
      padding: '0 1.9rem',
      margin: '1rem 0 0 1.3rem',
      width: '90%',
      '& textarea': {
        color: 'rgb(66, 66, 66, 0.6)',
        fontSize: '.8rem',
        background: 'transparent',
        background: 'rgba(220, 244, 197, 0.05)',
        maxHeight: '4rem',
      },
      '& .MuiInput-formControl': {
        marginTop: '0',
      },
      '& .MuiInputBase-input': {
        marginTop: '0',
      },
    },
    chatAvatar: {
      position: 'relative',
      top: '0',
    },
    messageContent: {
      display: 'flex',
      width: 'fit-content',
      maxWidth: '90%',
      fontWeight: 400,
      color: theme.palette.common.bodyBlack,
      wordWrap: 'break-word',
      background: '#FFFFFF',
      backdropFilter: 'blur(4px)',
      borderRadius: '32px',
      padding: '.3rem 1.6rem .3rem .3rem',
      '& span': {
        width: '85%',
        alignSelf: 'center',
        marginLeft: '.6rem',
      },
      '& .MuiAvatar-root': {
        width: '1.7rem',
        height: '1.7rem',
      },
    },
    messageTimeStamp: {
      color: '#666666',
      fontSize: '0.75rem',
      marginLeft: theme.spacing(0.5),
    },
    minimizeChatIcon: {
      color: theme.palette.common.ghostWhite,
      fontSize: '2rem',
      position: 'absolute',
      left: 'auto',
      right: 10,
      '&:hover': {
        color: theme.palette.common.basePink,
        cursor: 'pointer',
      },
    },
    sendersName: {
      color: '#666666',
      fontWeight: 600,
      fontSize: '9px',
      paddingLeft: '.46rem',
    },
  })
)

export default useNewLobbyStyles
