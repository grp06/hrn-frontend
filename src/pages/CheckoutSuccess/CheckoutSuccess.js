import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import { CongratsCard } from '.'

const CheckoutSuccess = ({ location }) => {
  const history = useHistory()
  const locationState = location.state && Object.keys(location.state).length ? location.state : {}

  useEffect(() => {
    if (!Object.keys(locationState).length) {
      return history.push('/pricing')
    }

    return () => {
      location.state = {}
    }
  }, [])

  return (
    <Grid contianer justify="center" alignItems="center" style={{ paddingTop: '100px' }}>
      <CongratsCard />
    </Grid>
  )
}

export default CheckoutSuccess
