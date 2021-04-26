// TODO Fix this after we update pricing
import React, { useRef, useState } from 'react'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import { Button, Grid, Typography } from '@material-ui/core'

import { HostInfoTable, useHostDirectoryStyles } from '.'
import { Loading } from '../../common'
import { useUserContext } from '../../context'
import { getUsersByRoleName } from '../../gql/queries'
import { constants } from '../../utils'

const PaidHostDashboard = () => {
  const classes = useHostDirectoryStyles()
  const { user } = useUserContext()
  const { adminUserIds, hrnFriendsUserIds } = constants
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
    },
  })

  const { data: hostPremiumData, loading: hostPremiumDataLoading } = useQuery(getUsersByRoleName, {
    variables: {
      role: 'host_premium',
    },
  })

  if (userId && !adminUserIds.includes(userId)) {
    return <Redirect to="/" />
  }

  if (hostDataLoading || hostStarterDataLoading || hostPremiumDataLoading) {
    return <Loading />
  }

  const getCurrentRevenueStats = () => {
    let paidStarterPlanNumbers
    let paidPremiumPlanNumbers

    if (hostStarterData) {
      paidStarterPlanNumbers = hostStarterData.users
        .filter((user) => !adminUserIds.includes(user.id) && !hrnFriendsUserIds.includes(user.id))
        .reduce(
          (total, user) => {
            const becameHostDate = moment(new Date(user.became_host_at))
            const subPeriodEndDate = moment(new Date(user.sub_period_end))
            const daysUntilSubEnds = subPeriodEndDate.diff(now.current, 'days')
            const totalDaysUserWillBeAPayingHost = subPeriodEndDate.diff(becameHostDate, 'days')
            // meaning the user had a yearly plan
            if (totalDaysUserWillBeAPayingHost > 360) {
              const yearsThatUserHasPaid = Math.ceil(totalDaysUserWillBeAPayingHost / 365)
              total.numberOfTotalPaidYearsOfStarterYearlyPlans += yearsThatUserHasPaid
              // meaning the plan is still active
              if (daysUntilSubEnds > 0) {
                total.activeStarterYearlyPlans++
              }
              return total
            }
            // meaning the user had a monthly plan
            const monthsThatUserHasPaid = Math.ceil(totalDaysUserWillBeAPayingHost / 30.5)
            total.numberOfTotalPaidMonthsOfStarterMonthlyPlans += monthsThatUserHasPaid
            // meaning the plan is still active
            if (daysUntilSubEnds > 0) {
              total.activeStarterMonthlyPlans++
            }
            return total
          },
          {
            activeStarterMonthlyPlans: 0,
            activeStarterYearlyPlans: 0,
            numberOfTotalPaidMonthsOfStarterMonthlyPlans: 0,
            numberOfTotalPaidYearsOfStarterYearlyPlans: 0,
          }
        )
    }

    if (hostPremiumData) {
      paidPremiumPlanNumbers = hostPremiumData.users
        .filter((user) => !adminUserIds.includes(user.id) && !hrnFriendsUserIds.includes(user.id))
        .reduce(
          (total, user) => {
            const becameHostDate = moment(new Date(user.became_host_at))
            const subPeriodEndDate = moment(new Date(user.sub_period_end))
            const daysUntilSubEnds = subPeriodEndDate.diff(now.current, 'days')
            const totalDaysUserWillBeAPayingHost = subPeriodEndDate.diff(becameHostDate, 'days')
            // meaning the user had a yearly plan
            if (totalDaysUserWillBeAPayingHost > 360) {
              const yearsThatUserHasPaid = Math.ceil(totalDaysUserWillBeAPayingHost / 365)
              total.numberOfTotalPaidYearsOfPremiumYearlyPlans += yearsThatUserHasPaid
              // meaning the plan is still active
              if (totalDaysUserWillBeAPayingHost > 0) {
                total.activePremiumYearlyPlans++
              }
              return total
            }
            // meaning the user had a monthly plan
            const monthsThatUserHasPaid = Math.ceil(totalDaysUserWillBeAPayingHost / 30.5)
            total.numberOfTotalPaidMonthsOfPremiumMonthlyPlans += monthsThatUserHasPaid
            // meaning the plan is still active
            if (totalDaysUserWillBeAPayingHost > 0) {
              total.activePremiumMonthlyPlans++
            }
            return total
          },
          {
            activePremiumMonthlyPlans: 0,
            activePremiumYearlyPlans: 0,
            numberOfTotalPaidMonthsOfPremiumMonthlyPlans: 0,
            numberOfTotalPaidYearsOfPremiumYearlyPlans: 0,
          }
        )
    }

    const totalMRR =
      paidStarterPlanNumbers && paidPremiumPlanNumbers
        ? paidStarterPlanNumbers.activeStarterMonthlyPlans * 59 +
          paidStarterPlanNumbers.activeStarterYearlyPlans * 49 +
          paidPremiumPlanNumbers.activePremiumMonthlyPlans * 169 +
          paidPremiumPlanNumbers.activePremiumYearlyPlans * 149
        : 0

    const totalRevenue =
      paidStarterPlanNumbers && paidPremiumPlanNumbers
        ? paidStarterPlanNumbers.numberOfTotalPaidMonthsOfStarterMonthlyPlans * 59 +
          paidStarterPlanNumbers.numberOfTotalPaidYearsOfStarterYearlyPlans * 588 +
          paidPremiumPlanNumbers.numberOfTotalPaidMonthsOfPremiumMonthlyPlans * 169 +
          paidPremiumPlanNumbers.numberOfTotalPaidYearsOfPremiumYearlyPlans * 1788
        : 0

    return { totalMRR, totalRevenue, paidStarterPlanNumbers, paidPremiumPlanNumbers }
  }

  const getArrayOfHostsBetweenTimeFrame = (userArray) =>
    userArray.users && userArray.users.length
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

  const renderHostTables = () => {
    const unpaidHosts = hostData && getArrayOfHostsBetweenTimeFrame(hostData)
    const starterHosts = hostStarterData && getArrayOfHostsBetweenTimeFrame(hostStarterData)
    const premiumHosts = hostPremiumData && getArrayOfHostsBetweenTimeFrame(hostPremiumData)

    return (
      <Grid container direction="column">
        {premiumHosts && premiumHosts.length ? <HostInfoTable arrayOfHosts={premiumHosts} /> : null}
        {starterHosts && starterHosts.length ? <HostInfoTable arrayOfHosts={starterHosts} /> : null}
        {unpaidHosts && unpaidHosts.length ? (
          <HostInfoTable arrayOfHosts={unpaidHosts} hideSubPeriodEnd />
        ) : null}
      </Grid>
    )
  }

  const revenueStats = getCurrentRevenueStats()

  return (
    <Grid container>
      <Grid container direction="row" alignItems="center" justify="space-around">
        <Typography variant="h1" className={classes.revenueNumber}>
          $ {revenueStats.totalRevenue} TR
        </Typography>
        <Typography variant="h1" className={classes.revenueNumber}>
          $ {revenueStats.totalMRR} MRR
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
            Active Starters
          </Typography>
          <Typography variant="h1" className={classes.largeNumber} style={{ color: '#FF99AD' }}>
            {hostStarterData &&
              hostStarterData.users
                .filter(
                  (user) => !adminUserIds.includes(user.id) && !hrnFriendsUserIds.includes(user.id)
                )
                .filter((user) => new Date(user.sub_period_end) > new Date()).length}
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
            Active Premiums
          </Typography>
          <Typography variant="h1" className={classes.largeNumber} style={{ color: '#fabb5b' }}>
            {hostPremiumData &&
              hostPremiumData.users
                .filter(
                  (user) => !adminUserIds.includes(user.id) && !hrnFriendsUserIds.includes(user.id)
                )
                .filter((user) => new Date(user.sub_period_end) > new Date()).length}
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
        <Button
          variant="contained"
          color="default"
          onClick={() => setNumberOfDaysToCompare(99999)}
          disableRipple
          className={numberOfDaysToCompare === 99999 ? classes.activeTimeframeButton : null}
        >
          Inception
        </Button>
        {renderHostTables()}
      </Grid>
    </Grid>
  )
}

export default PaidHostDashboard
