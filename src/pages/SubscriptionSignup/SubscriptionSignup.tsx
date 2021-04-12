import React, { useState } from 'react'
import { NewSignupForm, OrganizationCreationForm } from '.'
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
    <OrganizationCreationForm />
    // <div>
    //   {componentToShow === 'signup' ? (
    //     <NewSignupForm showOrgForm={() => setComponentToShow('org')} />
    //   ) : (
    //     <OrganizationCreationForm />
    //   )}
    // </div>
  )
}

export default SubscriptionSignup
