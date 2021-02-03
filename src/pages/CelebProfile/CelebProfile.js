import React, { useState } from 'react'
import { Button, Grid } from '@material-ui/core'
import { useAppContext, useUserContext } from '../../context'
import { makeStyles } from '@material-ui/styles'
import { CelebProfileCard, EditCelebProfile } from '.'
import { Loading } from '../../common'
import constants from '../../utils/constants'
import { Redirect } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  editProfileButton: {
    position: 'fixed',
    top: 'auto',
    bottom: '0',
    width: '100vw',
    borderRadius: 0,
    height: '75px',
    maxHeight: 'none',
  },
  container: {
    marginTop: '75px',
    position: 'relative',
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
    <>
      <CelebProfileCard celeb={user} setIsEditing={setIsEditing} />
      <Button
        variant="contained"
        color="primary"
        size="large"
        className={classes.editProfileButton}
        onClick={() => setIsEditing(true)}
      >
        Edit Profile
      </Button>
    </>
  )

  // ! /chitchat is not implemented yet
  return role ? <Grid className={classes.container}>{content}</Grid> : <Redirect to="/chitchat" />
}

export default CelebProfile
