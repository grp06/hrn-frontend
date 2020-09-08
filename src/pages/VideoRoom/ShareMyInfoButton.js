import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/styles'
import { useMutation } from '@apollo/react-hooks'
import { Snack } from '../../common'
import { updateISharedDetails, updatePartnerSharedDetails } from '../../gql/mutations'

const useStyles = makeStyles((theme) => ({
  shareInfoButton: {
    width: '100%',
  },
}))
const ShareMyInfoButton = ({ myRound }) => {
  const classes = useStyles()
  const [sharedInfo, setSharedInfo] = useState(false)
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
      setSharedInfo(true)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <Button
        className={classes.shareInfoButton}
        variant="contained"
        color="default"
        onClick={handleShareMyInfoPress}
        disabled={sharedInfo}
      >
        Share My Info
      </Button>
      <Snack
        open={showShareMyInfoSnack}
        severity="info"
        snackMessage="Shared 📬"
        onClose={() => {
          setShowShareMyInfoSnack(false)
        }}
      />
    </>
  )
}

export default ShareMyInfoButton
