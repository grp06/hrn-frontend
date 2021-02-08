import React, { useEffect, useState } from 'react'
import { useLocation, Redirect } from 'react-router-dom'
import { SignUpForm } from '.'
import { getSubscriptionCheckoutObject } from '../Subscription'

const SignUp = () => {
  const location = useLocation()
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

  // check to see if a user is already logged in, if so redirect
  if (checkedSCOInLS && localStorage.getItem('userId')) {
    const subCheckoutObjectFromLS = JSON.parse(localStorage.getItem('subscriptionCheckoutObject'))
    const userClickedFreePlan =
      subCheckoutObjectFromLS && subCheckoutObjectFromLS.plan.includes('FREE')
    const usersRole = localStorage.getItem('role')
    if (usersRole && usersRole.includes('host') && userClickedFreePlan) {
      // redirect to create event because they clicked host an event from webflow
      return <Redirect to={{ pathname: '/create-event' }} />
    }
    return <Redirect to={{ pathname: '/checkout', state: subCheckoutObjectFromLS }} />
  }

  return <SignUpForm />
}

export default SignUp
