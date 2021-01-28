import React, { useEffect, useState } from 'react'
import { useLocation, Redirect } from 'react-router-dom'
import { SignUpForm } from '.'
import { Loading } from '../../common'
import { useAppContext, useUserContext } from '../../context'
import { getSubscriptionCheckoutObject } from '../Subscription'

const SignUp = () => {
  const location = useLocation()
  const { appLoading } = useAppContext()
  const {
    user: { role: usersRole },
  } = useUserContext()
  const searchParams = new URLSearchParams(location.search)
  const planType = searchParams.get('planType')
  const billingPeriod = searchParams.get('billingPeriod')
  const [checkedSCOInLS, setCheckedSCOInLS] = useState(false)

  // if we are coming from webflow, or passing query string to sign up (when you dont have an
  // an account and you click a sub on our app)
  useEffect(() => {
    if (billingPeriod && planType) {
      const subscriptionCheckoutObject = getSubscriptionCheckoutObject(billingPeriod, planType)
      localStorage.setItem('subscriptionCheckoutObject', JSON.stringify(subscriptionCheckoutObject))
    }
    setCheckedSCOInLS(true)
  }, [billingPeriod, planType])

  if (appLoading) {
    return <Loading />
  }

  // check to see if a user is already logged in, if so redirect
  if (checkedSCOInLS && localStorage.getItem('userId')) {
    const subCheckoutObjectFromLS = localStorage.getItem('subscriptionCheckoutObject')
    if (subCheckoutObjectFromLS && (!usersRole || usersRole === 'user')) {
      console.log('im nothing boiii')
      return <Redirect to={{ pathname: '/checkout', state: JSON.parse(subCheckoutObjectFromLS) }} />
    } else if (subCheckoutObjectFromLS && usersRole.includes('host')) {
      console.log('im a host')
      return <Redirect to={{ pathname: '/create-event' }} />
    }
    return <Redirect to="/events" />
  }

  return <SignUpForm />
}

export default SignUp
