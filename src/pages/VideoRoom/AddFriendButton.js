import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import { makeStyles } from '@material-ui/styles'
import { useMutation } from '@apollo/react-hooks'
import { Snack } from '../../common'
import { addFriend, updatePartnerSharedDetails } from '../../gql/mutations'

const useStyles = makeStyles((theme) => ({
  addFriendButton: {
    width: '60%',
    margin: theme.spacing(1, 0),
  },
}))
const AddFriendButton = ({ myRound }) => {
  const classes = useStyles()
  const [addedAsFriend, setAddedAsFriend] = useState(false)
  const [showAddedAsFriendSnack, setShowAddedAsFriendSnack] = useState(false)
  const { event_id, partner_id, user_id } = myRound
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
    <Grid container justify="center" alignItems="center">
      <Button
        className={classes.addFriendButton}
        variant="contained"
        size="small"
        color="default"
        onClick={handleAddFriendPress}
        disabled={addedAsFriend}
        endIcon={<PersonAddIcon />}
      >
        Add Friend
      </Button>
      <Snack
        open={showAddedAsFriendSnack}
        severity="info"
        snackMessage="Added 👫"
        onClose={() => {
          setShowAddedAsFriendSnack(false)
        }}
      />
    </Grid>
  )
}

export default AddFriendButton
