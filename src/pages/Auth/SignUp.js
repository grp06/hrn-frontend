import React, { useEffect, useState } from 'react'
import { useLocation, Redirect } from 'react-router-dom'
import { NewSignupForm } from '../SubscriptionSignup'

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
      localStorage.setItem('PLAN_TYPE', `${planType}_${billingPeriod}`)
    }
    setCheckedSCOInLS(true)
  }, [billingPeriod, planType])

  // check to see if a user is already logged in, if so redirect
  if (checkedSCOInLS && localStorage.getItem('userId')) {
    const usersRole = localStorage.getItem('role')
    if (usersRole) {
      // redirect to create event because they clicked host an event from webflow
      return <Redirect to={{ pathname: '/create-event' }} />
    }
  }
  return <NewSignupForm />
}

export default SignUp
