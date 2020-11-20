const getPricingPlanDetails = (billingPeriod) => {
  const freePlan = {
    name: 'Free',
    subtitle: 'Best for individuals',
    price: 'Free!',
    maxAttendees: 'Unlimiited',
    prevPlanHighlights: [],
    highlights: ['Relevant Mathing AI', 'Group Vidoe Chat', '1 Event'],
  }

  const starterPlan = {
    name: 'Starter',
    subtitle: 'Best for small communities',
    price: billingPeriod === 'monthly' ? '$59 / month' : '$49 / month',
    maxAttendees: 'Unlimited',
    prevPlanHighlights: ['Relevant Mathing AI', 'Group Vidoe Chat'],
    highlights: ['Unlimited Events', 'Event Branding', '1 Host Account'],
  }

  const premiumPlan = {
    name: 'Premium',
    subtitle: 'Best for large communities',
    price: billingPeriod === 'monthly' ? '$169 / month' : '$149 / month',
    maxAttendees: 'Unlimited',
    prevPlanHighlights: [
      'Relevant Matching AI',
      'Group Video Chat',
      'Unlimited Events',
      'Event Branding',
    ],
    highlights: [
      '5 Host Accounts',
      'Event Analytics',
      'Priority Support',
      'Advanced Matching Options',
    ],
  }

  return { freePlan, starterPlan, premiumPlan }
}

export default getPricingPlanDetails
