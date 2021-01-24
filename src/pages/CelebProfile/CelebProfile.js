import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { useAppContext, useUserContext } from '../../context'
import { makeStyles } from '@material-ui/styles'
import { CelebProfileCard, EditCelebProfile } from '.'
import { Loading } from '../../common'
import constants from '../../utils/constants'
import { Redirect } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '75px',
  },
}))

const CelebProfile = () => {
  const role = localStorage.getItem(constants.ROLE)

  const classes = useStyles()
  const { appLoading } = useAppContext()
  const { user, updateUserNewObject } = useUserContext()
  const [isEditing, setIsEditing] = useState(false)

  if (appLoading || Object.keys(user).length < 2) {
    return <Loading />
  }

  const content = isEditing ? (
    <EditCelebProfile
      celeb={user}
      setIsEditing={setIsEditing}
      updateUserNewObjectInContext={updateUserNewObject}
    />
  ) : (
    <CelebProfileCard celeb={user} setIsEditing={setIsEditing} />
  )

  // ! /chitchat is not implemented yet
  return role ? <Grid className={classes.container}>{content}</Grid> : <Redirect to="/chitchat" />
}

export default CelebProfile
