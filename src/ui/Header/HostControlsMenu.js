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

const SettingsMenu = () => {
  const classes = useStyles()
  const history = useHistory()
  const [menuOpen, setMenuOpen] = useState(false)
  const anchorRef = useRef(null)

  const handleMenuOpen = () => {
    setMenuOpen((prevOpen) => !prevOpen)
  }

  const handleMenuClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }
    setMenuOpen(false)
  }

  const handleHostEvent = () => {
    history.push('/create-event')
    setMenuOpen(false)
  }

  const handleMyAnalytics = () => {
    history.push('/host-dashboard')
    setMenuOpen(false)
  }

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      setMenuOpen(false)
    }
  }
  return (
    <div>
      <IconButton color="inherit" onClick={handleMenuOpen} ref={anchorRef} disableRipple>
        <FeatherIcon icon="menu" stroke="#f4f6fa" size="24" className={classes.headerIcon} />
      </IconButton>
      <Popper
        open={menuOpen}
        anchorEl={anchorRef.current}
        placement="bottom-end"
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
                  // MenuListProps={{ onMouseLeave: handleMenuClose }}
                >
                  <MenuItem onClick={handleHostEvent} className={classes.menuItem}>
                    Host an Event
                  </MenuItem>
                  <MenuItem onClick={handleMyAnalytics} className={classes.menuItem}>
                    My Analytics
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}

export default SettingsMenu
