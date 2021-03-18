// @ts-nocheck
import { makeStyles } from '@material-ui/styles'

const useHostDirectoryStyles = makeStyles((theme) => ({
  hostDirectoryAvatar: {
    height: '100%',
    width: '100%',
  },
  hostDirectoryAvatarContainer: {
    height: '120px',
    width: '120px',
  },
  hostInfoCardContainer: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3, 3),
    },
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: 'auto',
    margin: theme.spacing(3, 'auto'),
    padding: theme.spacing(3, 5),
    width: '85%',
  },
  hostInfoContentContainer: {
    marginLeft: theme.spacing(4),
    width: '40%',
  },
}))

export default useHostDirectoryStyles
