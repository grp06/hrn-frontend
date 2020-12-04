import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'

import { HostOnboardingForm, ThankYouCard } from '.'
import { Loading } from '../../common'
import { useAppContext, useUserContext } from '../../context'

const useStyles = makeStyles((theme) => ({
  skipButton: {
    position: 'absolute',
    left: 'auto',
    right: '0%',
    bottom: 'auto',
    top: '0%',
    textTransform: 'none',
    color: theme.palette.common.ghostWhiteDark,
    fontWeight: 200,
  },
}))

const HostOnboarding = () => {
  const classes = useStyles()
  const history = useHistory()
  const { appLoading } = useAppContext()
  const { user } = useUserContext()
  const { city: user_city, tags_users } = user
  const [showThankYouCard, setShowThankYouCard] = useState(false)
  const userHasBeenOnboarded = user_city && tags_users.length

  if (appLoading) {
    return <Loading />
  }

  const handleRedirect = () => {
    if (userHasBeenOnboarded) {
      history.push('/create-event')
      return window.location.reload()
    }
    history.push('/onboarding')
  }

  return (
    <div style={{ paddingTop: '100px' }}>
      {showThankYouCard ? (
        <ThankYouCard handleRedirect={handleRedirect} userHasBeenOnboarded={userHasBeenOnboarded} />
      ) : (
        <HostOnboardingForm
          userHasBeenOnboarded={userHasBeenOnboarded}
          onFormSubmit={() => setShowThankYouCard(true)}
          onFormSkip={() => setShowThankYouCard(true)}
        />
      )}
    </div>
  )
}

export default HostOnboarding
