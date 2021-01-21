import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { useAppContext, useUserContext } from '../../context'
import { makeStyles } from '@material-ui/styles'
import { CelebProfileCard, EditCelebProfile } from '.'
import { Loading } from '../../common'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '75px',
  },
}))

const CelebProfile = () => {
  const classes = useStyles()
  const { appLoading } = useAppContext()
  const { user, updateUserNewObject } = useUserContext()
  const [contentState, setContentState] = useState('celeb-profile')

  if (appLoading || Object.keys(user).length < 2) {
    return <Loading />
  }

  const renderContent = () => {
    switch (contentState) {
      case 'edit-celeb-profile':
        return (
          <EditCelebProfile
            celeb={user}
            setCelebProfileContent={(contentState) => setContentState(contentState)}
            updateUserNewObjectInContext={(userObject) => updateUserNewObject(userObject)}
          />
        )
      default:
        return (
          <CelebProfileCard
            celeb={user}
            setCelebProfileContent={(contentState) => setContentState(contentState)}
          />
        )
    }
  }

  return <Grid className={classes.container}>{renderContent()}</Grid>
}

export default CelebProfile
