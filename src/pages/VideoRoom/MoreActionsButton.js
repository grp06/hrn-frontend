import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import SettingsIcon from '@material-ui/icons/Settings'
import ReportOutlinedIcon from '@material-ui/icons/ReportOutlined'
import BugReportIcon from '@material-ui/icons/BugReport'
import { ConnectionIssuesModal, ReportUserModal, SetupMicAndCameraModal } from '.'

const useStyles = makeStyles((theme) => ({
  fabButton: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    '&:hover': {
      borderRadius: '4px',
      backgroundColor: '#41444A',
    },
  },
  root: {
    height: 380,
    transform: 'translateZ(0px)',
    flexGrow: 1,
  },
  speedDial: {
    position: 'absolute',
    top: -20,
    minHeight: '40px',
  },
}))

const MoreActionsButton = ({ myRound }) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [showConnectionIssuesModal, setShowConnectionIssuesModal] = useState(false)
  const [showReportUserModal, setShowReportUserModal] = useState(false)
  const [showSetupMicAndCameraModal, setShowSetupMicAndCameraModal] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const actions = [
    {
      icon: <SettingsIcon style={{ color: '#8C57DB' }} />,
      name: 'Camera/Mic Settings',
      onClick: () => setShowSetupMicAndCameraModal(true),
    },
    {
      icon: <BugReportIcon style={{ color: '#8C57DB' }} />,
      name: 'Having Issues',
      onClick: () => setShowConnectionIssuesModal(true),
    },
    {
      icon: <ReportOutlinedIcon style={{ color: '#8C57DB' }} />,
      name: 'Report User',
      onClick: () => setShowReportUserModal(true),
    },
  ]

  // for some reason we need the Button for it to work
  return (
    <div className={classes.root}>
      <Button onClick={() => console.log('your boy')} />
      <SpeedDial
        ariaLabel="SpeedDial More actions"
        className={classes.speedDial}
        FabProps={{ className: classes.fabButton }}
        icon={<SettingsIcon style={{ color: 'ghostWhite', fontSize: '2rem' }} />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipPlacement="left"
            onClick={action.onClick || handleClose}
          />
        ))}
      </SpeedDial>
      {showConnectionIssuesModal && (
        <ConnectionIssuesModal
          myRound={myRound}
          open={showConnectionIssuesModal}
          setOpen={setShowConnectionIssuesModal}
        />
      )}
      {showReportUserModal && (
        <ReportUserModal
          myRound={myRound}
          open={showReportUserModal}
          setOpen={setShowReportUserModal}
        />
      )}
      {showSetupMicAndCameraModal && (
        <SetupMicAndCameraModal
          open={showSetupMicAndCameraModal}
          setOpen={setShowSetupMicAndCameraModal}
        />
      )}
    </div>
  )
}

export default MoreActionsButton
