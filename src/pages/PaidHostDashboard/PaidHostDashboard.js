import React from 'react'
import { useQuery } from 'react-apollo'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'

import { Loading } from '../../common'
import { useUserContext } from '../../context'
import { getUsersByRoleName } from '../../gql/queries'

const useStyles = makeStyles((theme) => ({}))

const PaidHostDashboard = () => {
  const classes = useStyles()
  const user = useUserContext()
  const { id: userId } = user

  const { data: hostData, loading: hostDataLoading } = useQuery(getUsersByRoleName, {
    variables: {
      role: 'host',
    },
  })

  const { data: hostStarterData, loading: hostStarterDataLoading } = useQuery(getUsersByRoleName, {
    variables: {
      role: 'host_starter',
    },
  })

  const { data: hostPremiumData, loading: hostPremiumDataLoading } = useQuery(getUsersByRoleName, {
    variables: {
      role: 'host_premium',
    },
  })

  if (hostDataLoading || hostStarterDataLoading || hostPremiumDataLoading) {
    return <Loading />
  }

  console.log('hostData ->', hostData)
  console.log('hostStarterData ->', hostStarterData)
  console.log('hostPremiumData ->', hostPremiumData)

  return (
    <Grid container direction="row">
      <Grid container item md={6} direction="column" justify="center" alignItems="center">
        <Typography variant="h1">Unpaid Hosts</Typography>
        <Typography variant="h1">{hostData.users.length}</Typography>
      </Grid>
      <Grid container item md={6} direction="column" justify="center" alignItems="center">
        <Typography variant="h1">Starter Hosts</Typography>
        <Typography variant="h1">{hostStarterData.users.length}</Typography>
      </Grid>
      <Grid container item md={6} direction="column" justify="center" alignItems="center">
        <Typography variant="h1">Premium Hosts</Typography>
        <Typography variant="h1">{hostPremiumData.users.length}</Typography>
      </Grid>
    </Grid>
  )
}

export default PaidHostDashboard
