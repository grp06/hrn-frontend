import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import ReportOutlinedIcon from '@material-ui/icons/ReportOutlined'
import Typography from '@material-ui/core/Typography'
import { TransitionModal } from '../../common'
import { updateLeftChat, reportPartner } from '../../gql/mutations'

const ReportUserButton = ({ myRound }) => {
  const history = useHistory()
  const { event_id, id: row_id, user_id, partner_id, created_at: convo_started_at } = myRound

  const [updateLeftChatMutation] = useMutation(updateLeftChat, {
    variables: {
      row_id,
      reason: 'reported my partner',
    },
  })

  const [reportPartnerMutation] = useMutation(reportPartner, {
    variables: {
      user_id,
      partner_id,
      reason: 'default',
      convo_started_at,
      event_id,
    },
  })

  const exitChat = async () => {
    try {
      await updateLeftChatMutation()
      await reportPartnerMutation()
      window.location.reload()
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
    onAcceptFunction: () => exitChat(),
  })
  return <div>{renderReportUserButton}</div>
}

export default ReportUserButton
