import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import { HostOnboardingForm, ThankYouCard } from '.'
import { Loading } from '../../common'
import { useUserContext } from '../../context'

const HostOnboarding = () => {
  const history = useHistory()
  const { user, userContextLoading } = useUserContext()
  const { id: user_id, city: user_city, tags_users } = user
  const [showThankYouCard, setShowThankYouCard] = useState(false)
  const userHasBeenOnboarded = user_city && tags_users.length

  if (userContextLoading) {
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
          onFormSkip={() => {
            window.analytics.track('skipped host questionnaire')
            setShowThankYouCard(true)
          }}
          onFormSubmit={() => setShowThankYouCard(true)}
          userId={user_id}
        />
      )}
    </div>
  )
}

export default HostOnboarding
