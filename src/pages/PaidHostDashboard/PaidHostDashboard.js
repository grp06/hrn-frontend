import React, { useRef, useState } from 'react'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import { HostInfoTable } from '.'
import { Loading } from '../../common'
import { useUserContext } from '../../context'
import { getUsersByRoleName } from '../../gql/queries'
import { constants } from '../../utils'

const useStyles = makeStyles((theme) => ({
  activeTimeframeButton: {
    backgroundColor: theme.palette.common.basePink,
  },
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
  const [numberOfDaysToCompare, setNumberOfDaysToCompare] = useState(1)
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

  if (userId && !adminUserIds.includes(userId)) {
    return <Redirect to="/" />
  }

  if ((hostDataLoading, hostStarterDataLoading, hostPremiumDataLoading)) {
    return <Loading />
  }

  const getCurrentMRR = () => {
    let paidStarterPlanNumbers, paidPremiumPlanNumbers

    if (hostStarterData) {
      paidStarterPlanNumbers = hostStarterData.users
        .filter((user) => !adminUserIds.includes(user.id))
        .reduce(
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
      paidPremiumPlanNumbers = hostPremiumData.users
        .filter((user) => !adminUserIds.includes(user.id))
        .reduce(
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
      paidStarterPlanNumbers && paidPremiumPlanNumbers
        ? paidStarterPlanNumbers.starterMonthlyPlans * 59 +
          paidStarterPlanNumbers.starterYearlyPlans * 588 +
          paidPremiumPlanNumbers.premiumMonthlyPlans * 169 +
          paidPremiumPlanNumbers.premiumYearlyPlans * 1788
        : 0

    return { totalMRR, paidStarterPlanNumbers, paidPremiumPlanNumbers }
  }

  const getArrayOfHostsBetweenTimeFrame = (userArray) => {
    return userArray.users && userArray.users.length
      ? userArray.users
          .filter((user) => !adminUserIds.includes(user.id))
          .filter((user) => {
            const compareDate = moment(new Date(user.became_host_at))
            const dateTo = moment().endOf('day').format('YYYY-MM-DD')
            const dateFrom = moment()
              .subtract(numberOfDaysToCompare, 'days')
              .endOf('day')
              .format('YYYY-MM-DD')
            return compareDate.isBetween(dateFrom, dateTo, 'days', '[]')
          })
      : []
  }

  const renderHostTables = () => {
    const unpaidHosts = hostData && getArrayOfHostsBetweenTimeFrame(hostData)
    const starterHosts = hostStarterData && getArrayOfHostsBetweenTimeFrame(hostStarterDataLoading)
    const premiumHosts = hostPremiumData && getArrayOfHostsBetweenTimeFrame(hostPremiumData)

    return (
      <Grid container direction="column">
        {unpaidHosts && unpaidHosts.length ? <HostInfoTable arrayOfHosts={unpaidHosts} /> : null}
        {starterHosts && starterHosts.length ? <HostInfoTable arrayOfHosts={starterHosts} /> : null}
        {premiumHosts && premiumHosts.length ? <HostInfoTable arrayOfHosts={premiumHosts} /> : null}
      </Grid>
    )
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
            {hostStarterData &&
              hostStarterData.users.filter((user) => !adminUserIds.includes(user.id)).length}
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
            {hostPremiumData &&
              hostPremiumData.users.filter((user) => !adminUserIds.includes(user.id)).length}
          </Typography>
        </Grid>
      </Grid>
      <Grid container direction="row" justify="space-around" alignItems="center">
        <Button
          variant="contained"
          color="default"
          onClick={() => setNumberOfDaysToCompare(1)}
          disableRipple
          className={numberOfDaysToCompare === 1 ? classes.activeTimeframeButton : null}
        >
          Last 24 hours
        </Button>
        <Button
          variant="contained"
          color="default"
          onClick={() => setNumberOfDaysToCompare(7)}
          disableRipple
          className={numberOfDaysToCompare === 7 ? classes.activeTimeframeButton : null}
        >
          Last 7 days
        </Button>
        <Button
          variant="contained"
          color="default"
          onClick={() => setNumberOfDaysToCompare(30)}
          disableRipple
          className={numberOfDaysToCompare === 30 ? classes.activeTimeframeButton : null}
        >
          Last 30 days
        </Button>
        {renderHostTables()}
      </Grid>
    </Grid>
  )
}

export default PaidHostDashboard
