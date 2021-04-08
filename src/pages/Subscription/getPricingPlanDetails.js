import ProPlanIcon from '../../assets/proPlanIcon.svg'
import StarterPlanIcon from '../../assets/starterPlanIcon.svg'

const getPricingPlanDetails = (billingPeriod, role) => {
  const starterPlan = {
    name: 'Starter',
    price: 'Free!',
    icon: StarterPlanIcon,
    highlights: ['• Up to 25 attendees per event', '• Unlimited Events', '• Random Matching'],
    isActivePlan: role === 'host_starter',
    disableButton: role === 'host_premium',
  }

  const proPlan = {
    name: 'Pro',
    price: billingPeriod === 'monthly' ? '$99 / month' : '$79 / month',
    icon: ProPlanIcon,
    highlights: [
      '• Up to 75 attendees per event',
      '• Advanced Matching',
      '• Relevant Matching',
      '• Two Sided',
      '• Event Analytics',
      '• Custom Tags (soon)',
      '• Community / Team Page (soon)',
    ],
    isActivePlan: role === 'host_premium',
  }

  return { starterPlan, proPlan }
}

export default getPricingPlanDetails
