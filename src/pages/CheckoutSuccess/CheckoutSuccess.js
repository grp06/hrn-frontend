import React, { useEffect } from 'react'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import { CongratsCard, PaymentConfirmationCard } from '.'

const CheckoutSuccess = ({ location }) => {
  const history = useHistory()
  const locationState = location.state && Object.keys(location.state).length ? location.state : {}
  // if the user is a paid host locationState should be an object with
  // keys paymentMethodId, plan, and subscription
  // If the user is a free host locationState will have {freeHost: true}
  console.log(locationState)

  useEffect(() => {
    if (!Object.keys(locationState).length) {
      return history.push('/subscription')
    }

    return () => {
      window.history.replaceState({}, '')
    }
  }, [])

  const subscriptionStarts =
    locationState.subscription &&
    moment(new Date(locationState.subscription.created * 1000)).format('LL')

  const subscriptionEnds =
    locationState.subscription &&
    moment(new Date(locationState.subscription.current_period_end * 1000)).format('LL')

  const planName =
    locationState.plan &&
    locationState.plan.split('_')[0].charAt(0) +
      locationState.plan.split('_')[0].slice(1).toLowerCase()

  const planPeriod =
    locationState.plan &&
    locationState.plan.split('_')[1].charAt(0) +
      locationState.plan.split('_')[1].slice(1).toLowerCase()

  const planItem = `${planName} ${planPeriod}`

  const planPrice = locationState.subscription && locationState.subscription.plan.amount / 100

  return (
    <Grid container justify="center" alignItems="center" style={{ paddingTop: '100px' }}>
      <CongratsCard />
      {locationState.subscription ? (
        <PaymentConfirmationCard
          planItem={planItem}
          planPrice={planPrice}
          subscriptionStarts={subscriptionStarts}
          subscriptionEnds={subscriptionEnds}
        />
      ) : null}
    </Grid>
  )
}

export default CheckoutSuccess
