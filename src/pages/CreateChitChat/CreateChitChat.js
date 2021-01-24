import React, { useState } from 'react'
import { Grid } from '@material-ui/core'
import { CreateChitChatForm } from '.'
import { useUserContext } from '../../context'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({}))

const CreateChitChat = () => {
  const classes = useStyles()
  const {
    user: { id: user_id, role },
  } = useUserContext()

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      style={{ marginTop: '75px' }}
    >
      <CreateChitChatForm userId={user_id} />
    </Grid>
  )
}

export default CreateChitChat
