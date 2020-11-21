import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { CheckoutCard } from '.'
import { useAppContext, useUserContext } from '../../context'
import { Loading } from '../../common'
import { createStripeCustomer } from '../../utils'

const Checkout = ({ location }) => {
  const history = useHistory()
  const { appLoading } = useAppContext()
  const { user } = useUserContext()
  const [userHasStripeId, setUserHasStripeId] = useState(false)
  const locationState = location.state && Object.keys(location.state).length ? location.state : {}
  const { plan, planPrice } = locationState

  useEffect(() => {
    if (!Object.keys(locationState).length) {
      return history.push('/pricing')
    }
    return () => {
      console.log('hitting this shit')
      location.state = {}
    }
  }, [])

  useEffect(() => {
    if (user && Object.keys(user).length > 4) {
      const { email, id: userId, name, stripe_customer_id } = user
      if (!stripe_customer_id) {
        console.log('im getting in here')
        createStripeCustomer(email, name, userId)
      }
      return setUserHasStripeId(true)
    }
  }, [user])

  if (appLoading && !userHasStripeId) {
    return <Loading />
  }

  return <CheckoutCard plan={plan} price={planPrice} />
}

export default Checkout
