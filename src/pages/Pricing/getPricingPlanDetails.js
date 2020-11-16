const getPricingPlanDetails = (billingPeriod) => {
  const freePlan = {
    name: 'Free',
    subtitle: 'Best for individuals',
    price: 'Free!',
    maxAttendees: 30,
    prevPlanHighlights: [],
    highlights: ['Unlimited Events', 'Standard Matching'],
  }

  const plusPlan = {
    name: 'Plus',
    subtitle: 'Best for small communities',
    price: billingPeriod === 'monthly' ? '$49 / month' : '$39 / month',
    maxAttendees: 300,
    prevPlanHighlights: ['Unlimited Events', 'Standard Matching'],
    highlights: ['Advanced Matching', 'Group Video', 'Event data analysis', 'Added logo'],
  }

  const proPlan = {
    name: 'Pro',
    subtitle: 'Best for large communities',
    price: billingPeriod === 'monthly' ? '$129 / month' : '$99 / month',
    maxAttendees: 300,
    prevPlanHighlights: [
      'Unlimited Events',
      'Standard Matching',
      'Advanced Matching',
      'Group Video',
      'Event data analysis',
      'Added logo',
    ],
    highlights: ['Custom branding', 'Custom user tags', 'Concierge support'],
  }

  return { freePlan, plusPlan, proPlan }
}

export default getPricingPlanDetails
