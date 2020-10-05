import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/styles'
import { useMutation } from '@apollo/react-hooks'
import { Snack } from '../../common'
import { addFriend, updatePartnerSharedDetails } from '../../gql/mutations'

const useStyles = makeStyles((theme) => ({
  addFriendButton: {
    width: '100%',
    margin: theme.spacing(1, 0),
  },
}))

const AddFriendButton = React.memo(({ myRound }) => {
  const classes = useStyles()
  const { event_id, partner_id, user_id, i_shared_details } = myRound
  console.log('i share detials', i_shared_details)
  console.log('myround->>>>>>>>', myRound)

  const [addedAsFriend, setAddedAsFriend] = useState(false)
  const [showAddedAsFriendSnack, setShowAddedAsFriendSnack] = useState(false)
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
    setAddedAsFriend(false)
  }, [myRound])

  useEffect(() => {
    setAddedAsFriend(!i_shared_details ? false : true)
  }, [i_shared_details])

  const handleAddFriendPress = async () => {
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
