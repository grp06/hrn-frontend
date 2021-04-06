// @ts-nocheck
import { makeStyles } from '@material-ui/styles'
import PersonIcon from '../../assets/greyPerson.svg'
import MicOffIcon from '../../assets/micOff.svg'

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
}))

export default useNewLobbyStyles
