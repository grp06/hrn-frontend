import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import { CheckoutCard, CheckoutForm } from '.'
import { useAppContext, useUserContext } from '../../context'
import { Loading } from '../../common'
import { createStripeCustomer } from '../../utils'

const Checkout = ({ location }) => {
  const history = useHistory()
  const { appLoading } = useAppContext()
  const { user } = useUserContext()
  const { id: userId, email: userEmail } = user
  const [userHasStripeId, setUserHasStripeId] = useState(false)
  const locationState = location.state && Object.keys(location.state).length ? location.state : {}
  const { plan, planPrice } = locationState

  useEffect(() => {
    if (!Object.keys(locationState).length) {
      return history.push('/subscription')
    }
    return () => {
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

  return (
    <Grid contianer justify="center" alignItems="center" style={{ paddingTop: '100px' }}>
      <CheckoutCard
        form={
          <CheckoutForm
            plan={plan}
            stripeCustomerId={user.stripe_customer_id}
            userId={userId}
            userEmail={userEmail}
          />
        }
        plan={plan}
        price={planPrice}
      />
    </Grid>
  )
}

export default Checkout
