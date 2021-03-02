import React, { useEffect } from 'react'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import { useHistory } from 'react-router-dom'
import { Grid } from '@material-ui/core'

import { CongratsCard, PaymentConfirmationCard } from '.'
import { Loading } from '../../common'
import { useUserContext } from '../../context'
import { getHostQuestionnaire } from '../../gql/queries'

const CheckoutSuccess = ({ location }) => {
  const history = useHistory()
  const { user } = useUserContext()
  const { id: user_id, stripe_customer_id } = user
  const locationState = location.state && Object.keys(location.state).length ? location.state : {}
  // if the user is a paid host locationState should be an object with
  // keys paymentMethodId, plan, and subscription
  // If the user is a free host locationState will have {freeHost: true}

  const { data: hostQuestionnaireQuery, loading: hostQuestionnaireQueryLoading } = useQuery(
    getHostQuestionnaire,
    {
      variables: {
        user_id,
      },
      skip: !user_id,
    }
  )

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

  const planPrice = locationState.subscription?.plan.amount / 100

  if (hostQuestionnaireQueryLoading) {
    return <Loading />
  }

  const userHasDoneHostQuestionnaire = hostQuestionnaireQuery?.host_questionnaire.length >= 1

  return (
    <Grid container justify="center" alignItems="center" style={{ paddingTop: '100px' }}>
      <CongratsCard userHasDoneHostQuestionnaire={userHasDoneHostQuestionnaire} />
      {locationState.subscription ? (
        <PaymentConfirmationCard
          planItem={planItem}
          planPrice={planPrice}
          subscriptionStarts={subscriptionStarts}
          subscriptionEnds={subscriptionEnds}
          stripeCustomerId={stripe_customer_id}
        />
      ) : null}
    </Grid>
  )
}

export default CheckoutSuccess
