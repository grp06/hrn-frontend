import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import SettingsIcon from '@material-ui/icons/Settings'
import ReportOutlinedIcon from '@material-ui/icons/ReportOutlined'
import BugReportIcon from '@material-ui/icons/BugReport'
import {
  ConnectionIssuesModal,
  ReportUserModal,
  SetupMicAndCameraModal,
  useVideoRoomStyles,
} from '.'

const MoreActionsButton = ({ myRound }) => {
  const classes = useVideoRoomStyles()
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
    <div className={classes.moreActionsButtonContainer}>
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
