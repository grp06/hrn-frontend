import PremiumPlanIcon from '../../assets/premiumPlanIcon.svg'
import StarterPlanIcon from '../../assets/starterPlanIcon.svg'

const getPricingPlanDetails = (billingPeriod, role) => {
  const freePlan = {
    name: 'Free',
    price: '$0 / month',
    icon: StarterPlanIcon,
    highlights: ['• Up to 25 attendees per event', '• Unlimited Events', '• Random Matching'],
    // TODO change to 'free'
    isActivePlan: role === 'free',
    disableButton: role === 'premium',
  }

  const premiumPlan = {
    name: 'Premium',
    price: billingPeriod === 'MONTHLY' ? '$99 / month' : '$79 / month',
    icon: PremiumPlanIcon,
    highlights: [
      '• Up to 75 attendees per event',
      '• Advanced Matching',
      '• Relevant Matching',
      '• Two Sided Events',
      '• Event Analytics',
      '• Custom Tags (soon)',
      '• Team Page (soon)',
    ],
    isActivePlan: role === 'premium',
  }

  return { freePlan, premiumPlan }
}

export default getPricingPlanDetails
