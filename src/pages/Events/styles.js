import { makeStyles } from '@material-ui/styles'
import blurryBackground from '../../assets/blurryBackground.png'

const useEventsStyles = makeStyles((theme) => ({
  // *****************************
  //   MyEvents
  // *****************************
  eventsPageBanner: {
    backgroundImage: `url(${blurryBackground})`,
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    height: '30vh',
    marginBottom: '40px',
    width: '100%',
  },
  eventsPageBannerContentContainer: {
    margin: theme.spacing(0, 'auto', 1.5, 'auto'),
    width: '70%',
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
}))

export default useEventsStyles
