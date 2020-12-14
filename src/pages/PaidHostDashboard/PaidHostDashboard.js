import React, { useRef } from 'react'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'

import { Loading } from '../../common'
import { useUserContext } from '../../context'
import { getUsersByRoleName } from '../../gql/queries'
import { constants } from '../../utils'

const useStyles = makeStyles((theme) => ({
  largeNumber: {
    fontSize: '10rem',
    marginTop: '-20px',
  },
  mrrNumber: {
    fontSize: '5rem',
    fontWeight: '500',
    color: '#00ff00',
    marginTop: '100px',
  },
  numberContainer: {
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(2, 0),
    },
  },
  numbersContainer: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    width: '90%',
    padding: theme.spacing(3, 5),
    margin: theme.spacing('100px', 'auto'),
  },
}))

const PaidHostDashboard = () => {
  const classes = useStyles()
  const user = useUserContext()
  const { adminUserIds } = constants
  const { id: userId } = user
  const now = useRef(new Date().toISOString())

  const { data: hostData, loading: hostDataLoading } = useQuery(getUsersByRoleName, {
    variables: {
      role: 'host',
    },
  })

  const { data: hostStarterData, loading: hostStarterDataLoading } = useQuery(getUsersByRoleName, {
    variables: {
      role: 'host_starter',
      now: now.current,
    },
  })

  const { data: hostPremiumData, loading: hostPremiumDataLoading } = useQuery(getUsersByRoleName, {
    variables: {
      role: 'host_premium',
      now: now.current,
    },
  })

  if (!adminUserIds.includes(userId)) {
    return <Redirect to="/" />
  }

  if ((hostDataLoading, hostStarterDataLoading, hostPremiumDataLoading)) {
    return <Loading />
  }

  const getCurrentMRR = () => {
    let paidStarterPlanNumbers, paidPremiumPlanNumbers

    if (hostStarterData) {
      paidStarterPlanNumbers = hostStarterData.users.reduce(
        (total, user) => {
          const subPeriodEndDate = moment(new Date(user.sub_period_end))
          const daysUntilSubEnds = subPeriodEndDate.diff(now.current, 'days')
          if (daysUntilSubEnds < 31 && daysUntilSubEnds >= 0) {
            total.starterMonthlyPlans++
            return total
          }
          total.starterYearlyPlans++
          return total
        },
        { starterMonthlyPlans: 0, starterYearlyPlans: 0 }
      )
    }

    if (hostPremiumData) {
      paidPremiumPlanNumbers = hostPremiumData.users.reduce(
        (total, user) => {
          const subPeriodEndDate = moment(new Date(user.sub_period_end))
          const daysUntilSubEnds = subPeriodEndDate.diff(now.current, 'days')
          if (daysUntilSubEnds < 31 && daysUntilSubEnds > 0) {
            total.premiumMonthlyPlans++
            return total
          }
          total.premiumYearlyPlans++
          return total
        },
        { premiumMonthlyPlans: 0, premiumYearlyPlans: 0 }
      )
    }

    const totalMRR =
      paidStarterPlanNumbers.starterMonthlyPlans * 59 +
      paidStarterPlanNumbers.starterYearlyPlans * 588 +
      paidPremiumPlanNumbers.premiumMonthlyPlans * 169 +
      paidPremiumPlanNumbers.premiumYearlyPlans * 1788

    return { totalMRR, paidStarterPlanNumbers, paidPremiumPlanNumbers }
  }

  const mrrStats = getCurrentMRR()

  return (
    <Grid container>
      <Grid container direction="row" alignItem="center" justify="center">
        <Typography variant="h1" className={classes.mrrNumber}>
          $ {mrrStats.totalMRR} MRR
        </Typography>
      </Grid>
      <Grid container direction="row" className={classes.numbersContainer}>
        <Grid
          container
          item
          md={4}
          className={classes.numberContainer}
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Typography variant="h4" style={{ color: '#8C57DB' }}>
            Unpaid Hosts
          </Typography>
          <Typography variant="h1" className={classes.largeNumber} style={{ color: '#8C57DB' }}>
            {hostData && hostData.users.length}
          </Typography>
        </Grid>
        <Grid
          container
          item
          md={4}
          className={classes.numberContainer}
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Typography variant="h4" style={{ color: '#FF99AD' }}>
            Starter Hosts
          </Typography>
          <Typography variant="h1" className={classes.largeNumber} style={{ color: '#FF99AD' }}>
            {hostStarterData && hostStarterData.users.length}
          </Typography>
        </Grid>
        <Grid
          container
          item
          md={4}
          className={classes.numberContainer}
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Typography variant="h4" style={{ color: '#fabb5b' }}>
            Premium Hosts
          </Typography>
          <Typography variant="h1" className={classes.largeNumber} style={{ color: '#fabb5b' }}>
            {hostPremiumData && hostPremiumData.users.length}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default PaidHostDashboard
