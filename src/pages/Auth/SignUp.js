import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SignUpForm } from '.'
import { getPricingPlanDetails } from '../Subscription'

const SignUp = () => {
  const location = useLocation()
  console.log('location ->', location)
  const searchParams = new URLSearchParams(location.search)
  const planType = searchParams.get('planType')
  const billingPeriod = searchParams.get('billingPeriod')
  const { starterPlan, premiumPlan } = getPricingPlanDetails(billingPeriod)
  const planHighlights =
    planType === 'starter'
      ? starterPlan.prevPlanHighlights.concat(starterPlan.highlights)
      : premiumPlan.prevPlanHighlights.concat(premiumPlan.highlights)
  const checkoutObject = { planType, billingPeriod, planHighlights }
  console.log('planType ->', planType)
  console.log('billingPeriod ->', billingPeriod)
  console.log('starterPlan ->', starterPlan)

  useEffect(() => {}, [])

  return <SignUpForm />
}

export default SignUp
