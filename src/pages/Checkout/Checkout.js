import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { CheckoutCard } from '.'

const Checkout = ({ location }) => {
  const history = useHistory()
  const locationState = location.state && Object.keys(location.state).length ? location.state : {}
  const { planName, planPrice, planPeriod } = locationState

  useEffect(() => {
    if (!Object.keys(locationState).length) {
      return history.push('/pricing')
    }
    return () => {
      console.log('hitting this shit')
      location.state = {}
    }
  }, [])
  return <CheckoutCard period={planPeriod} plan={planName} price={planPrice} />
}

export default Checkout
