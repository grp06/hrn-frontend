import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Grid } from '@material-ui/core'
import { CheckoutCard, CheckoutForm } from '.'
import { useUserContext } from '../../context'
import { Loading } from '../../common'
import { sleep, upgradeToHost } from '../../helpers'
import { constants, createStripeCustomer } from '../../utils'
const { ROLE, TOKEN } = constants

const Checkout = ({ location }) => {
  const history = useHistory()
  const { user, userContextLoading } = useUserContext()
  const { id: userId, email: userEmail } = user
  const [stripeCustomerId, setStripeCustomerId] = useState('')
  // we pass the planType, price and higlights when we history.push to checkout
  const locationState = location.state && Object.keys(location.state).length ? location.state : {}
  // locationState = typeof locationState === 'object' ? locationState : JSON.parse(locationState)
  const { plan, planPrice, planHighlights } = locationState

  const clearLS = useCallback(() => {
    location.state = {}
    localStorage.setItem('subscriptionCheckoutObject', '')
  }, [location.state])

  const redirectUserBackToSubscription = useCallback(() => {
    if (!Object.keys(locationState).length) {
      return history.push('/subscription')
    }
  }, [history, locationState])

  const makeUserFreeHost = useCallback(async () => {
    if (userId) {
      try {
        const upgradeToHostResponse = await upgradeToHost(userId)
        localStorage.setItem(ROLE, 'host')
        localStorage.setItem(TOKEN, upgradeToHostResponse.token)
        await sleep(400)
        history.push('/checkout-success', { freeHost: true })
        return window.location.reload()
      } catch (err) {
        console.log(err)
      }
    }
  }, [history, userId])

  const prepareStripeId = useCallback(async () => {
    if (!userContextLoading) {
      const { email, id: userId, name, stripe_customer_id } = user
      if (!stripe_customer_id) {
        const stripeCustomer = await createStripeCustomer(email, name, userId)
        return setStripeCustomerId(stripeCustomer.customer.id)
      }
      return setStripeCustomerId(stripe_customer_id)
    }
  }, [user, userContextLoading])

  useEffect(() => {
    redirectUserBackToSubscription()
    return () => {
      clearLS()
    }
  }, [clearLS, redirectUserBackToSubscription])

  useEffect(() => {
    if (plan && plan === 'FREE_FOREVER') {
      makeUserFreeHost()
    } else {
      prepareStripeId()
    }
  }, [makeUserFreeHost, plan, prepareStripeId])

  if (!stripeCustomerId || plan === 'FREE_FOREVER') {
    return <Loading />
  }

  return (
    <Grid container justify="center" alignItems="center" style={{ paddingTop: '100px' }}>
      <CheckoutCard
        form={
          <CheckoutForm
            plan={plan}
            stripeCustomerId={stripeCustomerId}
            userId={userId}
            userEmail={userEmail}
          />
        }
        plan={plan}
        planHighlights={planHighlights}
        price={planPrice}
      />
    </Grid>
  )
}

export default Checkout
