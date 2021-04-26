import { getPricingPlanDetails } from '.'

const getSubscriptionCheckoutObject = (billingPeriod, planType) => {
  const { premiumPlan, freePlan } = getPricingPlanDetails(billingPeriod)
  if (planType === 'free') {
    return { planPrice: 0, plan: 'FREE', planHighlights: freePlan.highlights }
  }

  if (planType === 'premium') {
    const checkoutStateObject =
      billingPeriod === 'monthly'
        ? { planPrice: 99, plan: 'PREMIUM_MONTHLY', planHighlights: premiumPlan.highlights }
        : { planPrice: 79, plan: 'PREMIUM_YEARLY', planHighlights: premiumPlan.highlights }

    return checkoutStateObject
  }
}

export default getSubscriptionCheckoutObject
