import { makeStyles } from '@material-ui/styles'
import blurryBackground from '../../assets/blurryBackground.png'

const useEventsPublicStyles = makeStyles((theme) => ({
  // *****************************
  //   MyEvents
  // *****************************
  eventsPublicPageBanner: {
    width: '100%',
    height: '30vh',
    backgroundImage: `url(${blurryBackground})`,
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    marginBottom: '40px',
  },
  eventsPublicPageBannerContentContainer: {
    margin: theme.spacing(0, 'auto', 1.5, 'auto'),
    width: '70%',
  },
  nullDataContainer: {
    padding: theme.spacing(5),
  },
  nullDataHeader: {
    textAlign: 'center',
  },
}))

export default useEventsPublicStyles
