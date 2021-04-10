import React, { useState } from 'react'
import { NewSignupForm } from '.'
import { Loading } from '../../common'
import { useUserContext } from '../../context'

const SubscriptionSignup: React.FC<{}> = () => {
  const { user, userContextLoading } = useUserContext()
  const { id: userId } = user
  const [componentToShow, setComponentToShow] = useState<string>('signup')

  if (userContextLoading) {
    return <Loading />
  }

  return (
    <div>
      {' '}
      <NewSignupForm />
    </div>
  )
}

export default SubscriptionSignup
