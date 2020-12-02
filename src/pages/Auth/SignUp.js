import React, { useEffect } from 'react'
import { useLocation, Redirect } from 'react-router-dom'
import { SignUpForm } from '.'
import { getSubscriptionCheckoutObject } from '../Subscription'

const SignUp = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const planType = searchParams.get('planType')
  const billingPeriod = searchParams.get('billingPeriod')

  useEffect(() => {
    if (billingPeriod && planType) {
      const subscriptionCheckoutObject = getSubscriptionCheckoutObject(billingPeriod, planType)
      localStorage.setItem('subscriptionCheckoutObject', JSON.stringify(subscriptionCheckoutObject))
    }
  }, [billingPeriod, planType])

  // check to see if a user is already logged in, if so redirect
  if (localStorage.getItem('userId')) {
    const subCheckoutObjectFromLS = localStorage.getItem('subscriptionCheckoutObject')
    if (subCheckoutObjectFromLS) {
      return <Redirect to={{ pathname: '/checkout', state: subCheckoutObjectFromLS }} />
    }
    return <Redirect to="/events" />
  }

  return <SignUpForm />
}

export default SignUp
