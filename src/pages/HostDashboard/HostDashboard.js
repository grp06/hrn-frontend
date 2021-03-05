import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { useHistory, Redirect } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import { HostMetricsSnapshot, HostEventsExpansionPanel, useHostDashboardStyles } from '.'
import { useUserContext } from '../../context'
import { FloatCardLarge, Loading } from '../../common'
import { getHostEventsAndRounds, getHostEventsAndPartners } from '../../gql/queries'

const HostDashboard = () => {
  const classes = useHostDashboardStyles()
  const history = useHistory()
  const { user, userContextLoading } = useUserContext()
  const { id: userId, role } = user
  const [allTimeRSVPed, setAllTimeRSVPed] = useState(0)
  const [allTimeMutualThumbs, setAllTimeMutualThumbs] = useState(0)
  const [avgThumbsPerEvent, setAvgThumbsPerEvent] = useState(0)

  const { data: eventsAndRoundsData } = useQuery(getHostEventsAndRounds, {
    variables: {
      userId: userId,
    },
    skip: !userId || (role && !role.includes('host')),
  })
  const { data: eventsAndPartnersData } = useQuery(getHostEventsAndPartners, {
    variables: {
      user_id: userId,
    },
    skip: !userId || (role && !role.includes('host')),
  })

  useEffect(() => {
    window.analytics.page('/host-dashbaord')
  }, [])

  useEffect(() => {
    if (role && !role.includes('premium')) {
      history.push('/events')
    }
  }, [history, role])

  useEffect(() => {
    // TODO: abstract to its own function that returns three variables
    // totalRSVP, totalThumbs, avgThumbs
    if (eventsAndPartnersData) {
      // calculate all the RSVPed people in all your events
      const totalRSVP = eventsAndPartnersData.events.reduce((total, event) => {
        total += event.event_users.length
        return total
      }, 0)

      // calcuate all the Mutual Thumbs in all your events
      const totalThumbs = eventsAndPartnersData.events.reduce((total, event) => {
        var partnerPairs = new Set()
        const mutualThumbsInEvent = event.partners.reduce((thumbTotal, userRow) => {
          if (!partnerPairs.has(`${userRow.user_id},${userRow.partner_id}`)) {
            if (userRow.i_shared_details && userRow.partner_shared_details) {
              thumbTotal += 1
            }
            partnerPairs.add(`${userRow.partner_id},${userRow.user_id}`)
          }
          return thumbTotal
        }, 0)
        total += mutualThumbsInEvent
        return total
      }, 0)

      // calculate average connections per event
      const averageThumbs = (totalThumbs / eventsAndPartnersData.events.length).toFixed(1)

      setAllTimeRSVPed(totalRSVP)
      setAllTimeMutualThumbs(totalThumbs)
      setAvgThumbsPerEvent(averageThumbs)
    }
  }, [eventsAndPartnersData])

  if (role && !role.includes('host')) {
    return <Redirect to="/events" />
  }

  if (!eventsAndPartnersData || userContextLoading) {
    return <Loading />
  }

  const hostHasEvents = eventsAndPartnersData?.events.length
  const hostHasCompletedEvents = eventsAndPartnersData?.events.some(
    (event) => event.status === 'complete'
  )

  if (!hostHasEvents || !hostHasCompletedEvents) {
    return (
      <div className={classes.noEventsContainer}>
        <FloatCardLarge>
          <Typography variant="h1" className={classes.noEventsMessage}>
            Once you host some events we&rsquo;ll show you some data!
          </Typography>
          <Typography variant="h1" className={classes.noEventsMessage}>
            Come back when you have created and finished an event!
          </Typography>
        </FloatCardLarge>
      </div>
    )
  }

  const totalMetrics = [{ allTimeRSVPed, allTimeMutualThumbs, avgThumbsPerEvent }]

  return (
    <div className={classes.hostDashboardPageContainer}>
      <Typography variant="h1" className={classes.dashboardSectionHeader}>
        Your Progress as a Host:
      </Typography>
      <FloatCardLarge>
        <HostMetricsSnapshot totalMetrics={totalMetrics} />
      </FloatCardLarge>
      <Typography variant="h1" className={classes.dashboardSectionHeader}>
        Your Past Events:
      </Typography>
      <div className={classes.expansionPanelContent}>
        <HostEventsExpansionPanel
          eventsAndRoundsData={eventsAndRoundsData}
          eventsAndPartnersData={eventsAndPartnersData}
        />
      </div>
    </div>
  )
}

export default HostDashboard
