import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import { CheckoutCard, CheckoutForm } from '.'
import { useAppContext, useUserContext } from '../../context'
import { Loading } from '../../common'
import { sleep, upgradeToHost } from '../../helpers'
import { createStripeCustomer } from '../../utils'

const Checkout = ({ location }) => {
  const history = useHistory()
  const { appLoading } = useAppContext()
  const { user } = useUserContext()
  const { id: userId, email: userEmail } = user
  const [stripeCustomerId, setStripeCustomerId] = useState('')
  // we pass the planType, price and higlights when we history.push to checkout
  const locationState = location.state && Object.keys(location.state).length ? location.state : {}
  // locationState = typeof locationState === 'object' ? locationState : JSON.parse(locationState)
  const { plan, planPrice, planHighlights } = locationState

  useEffect(() => {
    if (!Object.keys(locationState).length) {
      return history.push('/subscription')
    }
    return () => {
      location.state = {}
      localStorage.setItem('subscriptionCheckoutObject', '')
    }
  }, [])

  useEffect(() => {
    const prepareStripeId = async () => {
      if (user && Object.keys(user).length > 4) {
        const { email, id: userId, name, stripe_customer_id } = user
        if (!stripe_customer_id) {
          const stripeCustomer = await createStripeCustomer(email, name, userId)
          return setStripeCustomerId(stripeCustomer.customer.id)
        }
        return setStripeCustomerId(stripe_customer_id)
      }
    }

    const makeUserFreeHost = async () => {
      console.log('user ->', user)
      console.log('user.id ->', user.id)
      if (user && user.id) {
        try {
          const upgradeToHostResponse = await upgradeToHost(user.id)
          localStorage.setItem('token', upgradeToHostResponse.token)
          await sleep(400)
          history.push('/checkout-success', { freeHost: true })
          return window.location.reload()
        } catch (err) {
          console.log(err)
        }
      }
    }
    console.log('plan ->', plan)

    if (plan && plan === 'FREE_FOREVER') {
      makeUserFreeHost()
    } else {
      prepareStripeId()
    }
  }, [user, plan])

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
