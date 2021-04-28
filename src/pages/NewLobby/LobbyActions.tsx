import React from 'react'
import { makeStyles, DefaultTheme, Styles } from '@material-ui/styles'
import {
  ArrowBack as ArrowBackIcon,
  Create as CreateIcon,
  Share as ShareIcon,
} from '@material-ui/icons'
import { useHistory } from 'react-router-dom'

/** Themes */
import { themeOptions } from '../../ui/theme'

type LobbyActionsProps = {
  /** Name of the event */
  eventTitle: string | null
}

type CssClasses = {
  /** Styles for event title */
  title: string
  /** Styles for the whole component */
  container: string
  /** Styles for clickable action icons */
  icon: string
}

const createLobbyActionStyles = makeStyles(
  (theme: typeof themeOptions): Styles<DefaultTheme, {}, never> => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      height: '3rem',
      color: theme.palette.common.greyHover,
      marginLeft: '1.5rem',
    },
    title: {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: '800',
      fontSize: '18px',
      textAlign: 'center',
      height: 'fit-content',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    icon: {
      marginLeft: '2rem',
      width: '1.2rem',
      cursor: 'pointer',
      '&:nth-child(1)': {
        margin: '0 .6rem 0 0',
      },
    },
  })
)

const LobbyActions: React.FC<LobbyActionsProps> = (props) => {
  const { eventTitle } = props
  const history = useHistory()

  /** Classes for lobby top left actions */
  const classes = createLobbyActionStyles() as CssClasses

  return (
    <div className={classes.container}>
      <ArrowBackIcon onClick={() => history.goBack()} className={classes.icon} />
      <div className={classes.title}>{eventTitle}</div>
      <CreateIcon className={classes.icon} />
      <ShareIcon className={classes.icon} />
    </div>
  )
}

export default LobbyActions
