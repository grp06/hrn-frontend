import React, { useEffect, useState } from 'react'
import { Grid, Button } from '@material-ui/core'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { Snack } from '../../common'
import { addFriend, updatePartnerSharedDetails } from '../../gql/mutations'
import { didIShareDetailsInPrevEvent } from '../../gql/queries'
import { useVideoRoomStyles } from '.'

const AddFriendButton = React.memo(({ myRound }) => {
  const classes = useVideoRoomStyles()
  const { event_id, partner_id, user_id } = myRound

  const [addedAsFriend, setAddedAsFriend] = useState(false)
  const [showAddedAsFriendSnack, setShowAddedAsFriendSnack] = useState(false)

  const [getSharedDetailsInPrevEventData, { data: sharedDetailsInPrevEventData }] = useLazyQuery(
    didIShareDetailsInPrevEvent,
    {
      variables: {
        partner_id,
        user_id,
      },
    }
  )

  const [addFriendMutation] = useMutation(addFriend, {
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

  useEffect(() => {
    if (partner_id && user_id) {
      getSharedDetailsInPrevEventData()
    }
  }, [partner_id, user_id]) //eslint-disable-line

  useEffect(() => {
    if (sharedDetailsInPrevEventData && sharedDetailsInPrevEventData.partners.length) {
      setAddedAsFriend(true)
    } else {
      setAddedAsFriend(false)
    }
  }, [sharedDetailsInPrevEventData])

  const handleAddFriendPress = async () => {
    window.analytics.track('shared contact info')
    try {
      await addFriendMutation()
      await partnerSharedDetailsMutation()
      setShowAddedAsFriendSnack(true)
      setAddedAsFriend(true)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Grid>
      <Button
        className={classes.addFriendButton}
        variant="contained"
        size="small"
        color="default"
        onClick={handleAddFriendPress}
        disabled={addedAsFriend}
      >
        {!addedAsFriend ? 'Share My Info' : 'Info Shared'}
      </Button>
      <Snack
        open={showAddedAsFriendSnack}
        severity="info"
        snackMessage="Info shared! 📫"
        onClose={() => {
          setShowAddedAsFriendSnack(false)
        }}
      />
    </Grid>
  )
})

export default AddFriendButton
