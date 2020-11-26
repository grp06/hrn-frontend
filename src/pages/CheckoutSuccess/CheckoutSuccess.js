import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import { CongratsCard } from '.'

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

  return (
    <Grid container justify="center" alignItems="center" style={{ paddingTop: '100px' }}>
      <CongratsCard />
    </Grid>
  )
}

export default CheckoutSuccess
