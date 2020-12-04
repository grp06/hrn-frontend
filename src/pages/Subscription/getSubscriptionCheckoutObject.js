import { getPricingPlanDetails } from '.'

const getSubscriptionCheckoutObject = (billingPeriod, planType) => {
  const { starterPlan, premiumPlan, freePlan } = getPricingPlanDetails(billingPeriod)
  if (planType === 'starter') {
    const planHighlights = starterPlan.prevPlanHighlights.concat(starterPlan.highlights)
    const checkoutStateObject =
      billingPeriod === 'monthly'
        ? { planPrice: 59, plan: 'STARTER_MONTHLY', planHighlights }
        : { planPrice: 49, plan: 'STARTER_YEARLY', planHighlights }

    return checkoutStateObject
  }

  if (planType === 'premium') {
    const planHighlights = premiumPlan.prevPlanHighlights.concat(premiumPlan.highlights)
    const checkoutStateObject =
      billingPeriod === 'monthly'
        ? { planPrice: 169, plan: 'PREMIUM_MONTHLY', planHighlights }
        : { planPrice: 149, plan: 'PREMIUM_YEARLY', planHighlights }

    return checkoutStateObject
  }

  // else we passed in free plan
  return { planPrice: 0, plan: 'FREE_FOREVER', planHighlights: freePlan.highlights }
}

export default getSubscriptionCheckoutObject
