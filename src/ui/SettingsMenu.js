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
import { TransitionModal } from '../common'

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

const SettingsMenu = ({ resetUser }) => {
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

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      setMenuOpen(false)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    resetUser()
    setMenuOpen(false)
    history.push('/')
  }

  const myProfileClick = () => {
    history.push('/my-profile')
  }

  const logoutClick = () => {
    handleLogout()
    setMenuOpen(false)
  }

  return (
    <div>
      <IconButton color="inherit" onClick={handleMenuOpen} ref={anchorRef} disableRipple>
        <FeatherIcon icon="settings" stroke="#f4f6fa" size="24" className={classes.headerIcon} />
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
                >
                  <MenuItem onClick={myProfileClick} className={classes.menuItem}>
                    My Profile
                  </MenuItem>
                  <MenuItem onClick={logoutClick} className={classes.menuItem}>
                    Log Out
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
