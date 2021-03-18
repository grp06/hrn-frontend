// @ts-nocheck
import { makeStyles } from '@material-ui/styles'

const useHostDirectoryStyles = makeStyles((theme) => ({
  downloadButton: {
    // '& svg': {
    //   marginLeft: theme.spacing(1),
    // },
    alignItems: 'center',
    backgroundColor: theme.palette.common.basePurple,
    borderRadius: 4,
    color: theme.palette.common.ghostWhite,
    display: 'flex',
    flexWrap: 'nowrap',
    fontFamily: 'Muli',
    margin: `0 8px 8px 8px`,
    padding: '8px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    width: '200px',
  },
  hostDirectoryAvatar: {
    height: '100%',
    width: '100%',
  },
  hostDirectoryAvatarContainer: {
    height: '120px',
    width: '120px',
  },
  hostedEventsContainer: {
    width: '85%',
    margin: theme.spacing(3, 'auto'),
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
