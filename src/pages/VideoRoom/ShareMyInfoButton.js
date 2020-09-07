import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Snack } from '../../common'
import { updateISharedDetails, updatePartnerSharedDetails } from '../../gql/mutations'
import Button from '@material-ui/core/Button'

const ShareMyInfoButton = ({ myRound }) => {
  const [showShareMyInfoSnack, setShowShareMyInfoSnack] = useState(false)
  const { event_id, partner_id, user_id } = myRound
  const [iSharedDetailsMutation] = useMutation(updateISharedDetails, {
    variables: {
      event_id,
      user_id,
      partner_id,
    },
  })
  const [partnerSharedDetailsMutation] = useMutation(updatePartnerSharedDetails, {
    variables: {
      event_id,
      user_id: partner_id,
      partner_id: user_id,
    },
  })
  const handleShareMyInfoPress = async () => {
    try {
      await iSharedDetailsMutation()
      await partnerSharedDetailsMutation()
      setShowShareMyInfoSnack(true)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <Button variant="contained" color="default" onClick={handleShareMyInfoPress}>
        Share My Info
      </Button>
      <Snack
        open={showShareMyInfoSnack}
        severity="success"
        snackMessage="Shared my info 🥳"
        onClose={() => {
          setShowShareMyInfoSnack(false)
        }}
      />
    </>
  )
}

export default ShareMyInfoButton
