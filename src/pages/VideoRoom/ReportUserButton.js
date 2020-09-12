import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import ReportOutlinedIcon from '@material-ui/icons/ReportOutlined'
import Typography from '@material-ui/core/Typography'
import { TransitionModal } from '../../common'
import { updateLeftChat } from '../../gql/mutations'

const ReportUserButton = ({ myRound }) => {
  const history = useHistory()
  const { event_id, id: row_id } = myRound

  const [reportUserMutation] = useMutation(updateLeftChat, {
    variables: {
      row_id,
      reason: 'partner being rude',
    },
  })

  const exitChat = async (mutation) => {
    try {
      await mutation()
      localStorage.setItem('userLeftChat', true)
      history.push(`/events/${event_id}/lobby`)
    } catch (err) {
      console.log(err)
    }
  }

  const renderReportUserButton = TransitionModal({
    iconButton: {
      iconButtonIcon: <ReportOutlinedIcon />,
      iconButtonColor: 'default',
      iconButtonSize: 'small',
    },
    modalBody: (
      <div>
        <Typography variant="h5" gutterBottom>
          Report this user?{' '}
          <span role="img" aria-label="mad face">
            🤬
          </span>
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          We take pride in only allowing high-quality, respectful people on our platform and
          therefore we do not take users being rude lightly. We appreciate you flagging this
          conversation and we may reach out to you to investigate this report.
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Are you sure you would like to report this user?
        </Typography>
      </div>
    ),
    onAcceptButtonText: 'Report this user',
    onAcceptFunction: () => exitChat(reportUserMutation),
  })
  return <div>{renderReportUserButton}</div>
}

export default ReportUserButton
