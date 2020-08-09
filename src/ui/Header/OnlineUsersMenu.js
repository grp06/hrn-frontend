import React, { useState, useRef } from 'react'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import FeatherIcon from 'feather-icons-react'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  menuItem: {
    cursor: 'default',
  },
  listItemText: {
    fontFamily: 'Muli',
    color: theme.palette.common.ghostWhiteBody,
    width: '100%',
    '&:hover': {
      color: theme.palette.common.sunray,
    },
  },
  popper: {
    marginLeft: theme.spacing(5),
  },
  popperPaper: {
    backgroundColor: theme.palette.common.greyCard,
  },
}))

const OnlineUsersMenu = ({ eventUsers }) => {
  const classes = useStyles()
  const anchorRef = useRef(null)
  const [onlineUsersMenuOpen, setOnlineUsersMenuOpen] = useState(false)

  const handleMenuOpen = () => {
    console.log('its your boi handleMenuOpen')
    setOnlineUsersMenuOpen((prevOpen) => !prevOpen)
  }

  const handleMenuClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }
    setOnlineUsersMenuOpen(false)
  }

  const handleListKeyDown = (clickEvent) => {
    if (clickEvent.key === 'Tab') {
      clickEvent.preventDefault()
      setOnlineUsersMenuOpen(false)
    }
  }

  return (
    <>
      <ListItem
        button
        disableRipple
        disableGutters
        key="onlineUsers"
        onClick={handleMenuOpen}
        className={classes.listItem}
      >
        <ListItemIcon>
          <FeatherIcon icon="users" stroke="#f4f6fa" size="24" />
        </ListItemIcon>
        <ListItemText
          disableTypography
          primary="Online Users"
          className={classes.listItemText}
          ref={anchorRef}
        />
      </ListItem>
      <Popper
        open={onlineUsersMenuOpen}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        role={undefined}
        transition
        disablePortal
        className={classes.popper}
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
                  autoFocusItem={onlineUsersMenuOpen}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                  // MenuListProps={{ onMouseLeave: handleMenuClose }}
                >
                  {eventUsers.map((userObject) => {
                    console.log('userObject ->', userObject)
                    return <MenuItem className={classes.menuItem}>{userObject.user.name}</MenuItem>
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}

export default OnlineUsersMenu
