import React, { useState } from 'react'
import Fab from '@material-ui/core/Fab'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  menuItem: {
    backgroundColor: theme.palette.common.greyCard,
  },
}))

const MoreActionsButton = ({ connectionIssues }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Fab
      disableRipple
      size="medium"
      color="inherit"
      aria-controls="more-actions-menu"
      aria-haspopup="true"
      onClick={handleClick}
    >
      <MoreHorizIcon style={{ color: '#6327bb' }} />
      <Menu
        id="more-actions-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} className={classes.menuItem}>
          {connectionIssues}
        </MenuItem>
        <MenuItem onClick={handleClose} className={classes.menuItem}>
          Mic and Camera
        </MenuItem>
      </Menu>
    </Fab>
  )
}

export default MoreActionsButton
