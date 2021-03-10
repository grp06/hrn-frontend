import { makeStyles } from '@material-ui/styles'
import ConfettiDoodlesSmallerScale from '../../assets/ConfettiDoodlesSmallerScale.svg'

const usePreEventStyles = makeStyles((theme) => ({
  // *****************************
  //   Animated Host Name Card
  // *****************************
  hostEmojiiContainer: {
    height: '100%',
    backgroundColor: theme.palette.common.greyCard,
    padding: theme.spacing(1),
  },
  hostNameCard: {
    position: 'absolute',
    top: 'auto',
    bottom: '90px',
    right: 'auto',
    left: '0',
    borderRadius: '4px',
    width: 'auto',
    minWidth: '300px',
    height: '80px',
  },
  hostNameContainer: {
    height: '100%',
    backgroundColor: theme.palette.common.basePurple,
    padding: theme.spacing(1),
  },

  // *****************************
  //   Pre Event
  // *****************************
  hostVid: {
    width: '100%',
    height: '100%',
    display: 'flex',
    '& video': {
      width: '100%',
      // height: 'calc(100vh)',
      height: '100%',
    },
  },
  preEventWrapper: {
    backgroundImage: `url(${ConfettiDoodlesSmallerScale})`,
    backgroundRepeat: 'repeat',
    backgroundSize: 'auto',
    height: '94vh',
  },
  liveAndViewersContainer: {
    position: 'absolute',
    top: '3%',
    left: '2%',
    bottom: 'auto',
    right: 'auto',
  },
  liveLogo: {
    width: '60px',
    height: 'auto',
    color: theme.palette.common.ghostWhite,
    fontWeight: 'bold',
    backgroundColor: theme.palette.common.red,
    borderRadius: '4px',
    textAlign: 'center',
  },
  viewersContainer: {
    marginTop: theme.spacing(1),
    backgroundColor: 'rgba(36,37,38,0.7)',
    borderRadius: '4px',
    width: '60px',
  },
  viewersNumber: {
    color: theme.palette.common.ghostWhite,
    marginLeft: theme.spacing(0.5),
  },
}))

export default usePreEventStyles
