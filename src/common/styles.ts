// @ts-nocheck
import { makeStyles } from '@material-ui/styles'

const useCommonComponentStyles = makeStyles((theme) => ({
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
