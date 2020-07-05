import React, { useState, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import FeatherIcon from 'feather-icons-react'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import { makeStyles } from '@material-ui/styles'
import { useMutation } from 'react-apollo'
import { TransitionModal } from '../common'
import { deleteRounds, resetEvent } from '../gql/mutations'
import { startEvent } from '../helpers'

const useStyles = makeStyles((theme) => ({
  headerIcon: {
    '&:hover': {
      stroke: theme.palette.common.sunray,
    },
  },
  popperPaper: {
    backgroundColor: theme.palette.common.greyCard,
  },
  menuItem: {
    '&:hover': {
      color: theme.palette.common.sunray,
    },
  },
}))

const HostEventControlsMenu = ({ event, user }) => {
  const classes = useStyles()
  const history = useHistory()
  const [menuOpen, setMenuOpen] = useState(false)
  const anchorRef = useRef(null)
  const { host_id, id: eventId, round_length, status: eventStatus, num_rounds } = event
  const { userId } = user
  const regex = /\/events\/\d+/
  const eventIdInUrl = Boolean(window.location.pathname.match(regex))
  const isEventHost = host_id === userId

  const [deleteRoundsMutation] = useMutation(deleteRounds, {
    variables: {
      eventId,
    },
  })
  const [resetEventMutation] = useMutation(resetEvent, {
    variables: {
      id: eventId,
    },
  })

  const handleMenuOpen = () => {
    setMenuOpen((prevOpen) => !prevOpen)
  }

  const handleMenuClose = (clickEvent) => {
    if (anchorRef.current && anchorRef.current.contains(clickEvent.target)) {
      return
    }
    setMenuOpen(false)
  }

  const handleListKeyDown = (clickEvent) => {
    if (clickEvent.key === 'Tab') {
      clickEvent.preventDefault()
      setMenuOpen(false)
    }
  }

  const handleStartEventModal = TransitionModal({
    button: {
      buttonText: 'Start Event',
      buttonVariant: 'text',
      buttonColor: 'default',
    },
    modalBody:
      'Starting the event will stop your current broadcast. Are you sure you want to start the event?',
    onAcceptButtonText: 'Lets Start!',
    onAcceptFunction: async () => {
      startEvent({ eventId, round_length, num_rounds })
    },
    onCloseFunction: () => {
      setMenuOpen(false)
    },
  })

  const handleResetEventModal = TransitionModal({
    button: {
      buttonText: 'Reset Event',
      buttonVariant: 'text',
      buttonColor: 'default',
    },
    modalBody: 'This will reset the event in its entirety. Are you 100% sure?',
    onAcceptFunction: async () => {
      await deleteRoundsMutation(eventId)
      await resetEventMutation(eventId)
      await startEvent({ eventId, num_rounds: null, round_length: null, reset: true })
    },
    onCloseFunction: () => {
      setMenuOpen(false)
    },
  })

  return isEventHost && eventIdInUrl && eventStatus !== 'not-started' ? (
    <div>
      <IconButton color="inherit" onClick={handleMenuOpen} ref={anchorRef} disableRipple>
        <FeatherIcon icon="command" stroke="#fabb5b" size="24" className={classes.headerIcon} />
      </IconButton>
      <Popper
        open={menuOpen}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper className={classes.popperPaper}>
              <ClickAwayListener onClickAway={handleMenuClose}>
                <MenuList
                  autoFocusItem={menuOpen}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
                  {eventStatus === 'pre-event' && (
                    <MenuItem className={classes.menuItem}>{handleStartEventModal}</MenuItem>
                  )}
                  <MenuItem onClick={handleMenuClose} className={classes.menuItem}>
                    Active Participants
                  </MenuItem>
                  <MenuItem className={classes.menuItem}>{handleResetEventModal}</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  ) : null
}

export default HostEventControlsMenu
