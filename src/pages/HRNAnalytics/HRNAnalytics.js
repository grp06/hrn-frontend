import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Redirect } from 'react-router-dom'
import {
  Grid,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'

import { EventExpansionPanelAdmin, useHRNAnalyticsStyles } from '.'
import { Loading } from '../../common'
import { useUserContext } from '../../context'
import { getAllUsers, getAllEvents, getAllRounds } from '../../gql/queries'
import { constants } from '../../utils'

const HRNAnalytics = () => {
  const classes = useHRNAnalyticsStyles()
  const { user } = useUserContext()
  const { adminUserIds } = constants
  const { id: userId } = user
  const { data: allDBUsers, loading: allDBUsersLoading } = useQuery(getAllUsers)
  const { data: allDBEventsAndRounds, loading: allDBEventsAndRoundsLoading } = useQuery(
    getAllEvents
  )
  const { data: roundsData, loading: roundsDataLoading } = useQuery(getAllRounds)

  const [value, setValue] = React.useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  if (userId && !adminUserIds.includes(userId)) {
    return <Redirect to="/" />
  }

  if (allDBUsersLoading || allDBEventsAndRoundsLoading || roundsDataLoading) {
    return <Loading />
  }

  const generateWeeksArr = () => {
    const weeksArr = []
    const firstEverEvent = 1592308800000
    const oneWeekInMs = 1000 * 60 * 60 * 24 * 7

    let idx = firstEverEvent
    const now = Date.now()
    while (idx < now) {
      weeksArr.push(idx)
      idx += oneWeekInMs
    }
    weeksArr.push(idx + oneWeekInMs)

    return weeksArr
  }

  const weeksArray = generateWeeksArr()

  const getCurrentWeek = (startAt) => {
    const startAtInMs = new Date(startAt).getTime()
    for (let i = 0; i < weeksArray.length; i++) {
      if (startAtInMs > weeksArray[i] && startAtInMs < weeksArray[i + 1]) {
        return weeksArray[i]
      }
    }
  }

  const rows = () => {
    return roundsData?.partners.reduce((all, item, index) => {
      const currentWeek = getCurrentWeek(item.event.start_at)
      const dateString = `${new Date(currentWeek).toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
      })}`

      const dateAlreadySet = all.find((item) => item[dateString])

      // first time we encounter a date lets push partnerX and partnerY and set the date
      if (!dateAlreadySet) {
        all.push({
          [dateString]: {
            attendees: [item.user && item.user.first_name, item.partner && item.partner.first_name],
            repeatAttendees: [],
          },
        })
      } else {
        const currentWeeksObj = all.find((item) => item[dateString])
        if (item.user) {
          // if partnerX is not in attendees
          if (currentWeeksObj[dateString].attendees.indexOf(item.user.first_name) === -1) {
            // push him into it

            currentWeeksObj[dateString].attendees.push(item.user.first_name)
            // look through all everything we've accumulated so far
            all.forEach((currentItem) => {
              // check to see that we arent looking at the week we just pushed our name to

              if (Object.keys(currentItem)[0] !== dateString) {
                // if we find our name in another attendees list, we participated that week
                // so we should count this week as a repeat

                if (
                  currentItem[Object.keys(currentItem)[0]].attendees.find(
                    (nameFoundInOtherEvent) => nameFoundInOtherEvent === item.user.first_name
                  )
                ) {
                  if (
                    currentWeeksObj[dateString].repeatAttendees.indexOf(item.user.first_name) === -1
                  ) {
                    currentWeeksObj[dateString].repeatAttendees.push(item.user.first_name)
                  }
                }
              }
            })
          }
        }

        if (item.partner) {
          if (currentWeeksObj[dateString].attendees.indexOf(item.partner.first_name) === -1) {
            currentWeeksObj[dateString].attendees.push(item.partner.first_name)
            all.forEach((currentItem) => {
              if (Object.keys(currentItem)[0] !== dateString) {
                if (
                  currentItem[Object.keys(currentItem)[0]].attendees.find(
                    (nameFoundInOtherEvent) => nameFoundInOtherEvent === item.partner.first_name
                  )
                ) {
                  if (
                    currentWeeksObj[dateString].repeatAttendees.indexOf(item.partner.first_name) ===
                    -1
                  ) {
                    currentWeeksObj[dateString].repeatAttendees.push(item.partner.first_name)
                  }
                }
              }
            })
          }
        }
      }
      return all
    }, [])
  }

  return (
    <div className={classes.hrnAnalyticsPageContainer}>
      <Grid
        container
        justify="space-around"
        alignItems="center"
        className={classes.systemNumbersSnapshotContainer}
      >
        <Grid container item direction="column" justify="center" alignItems="center">
          <Paper className={classes.root}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="All" />
              <Tab label="Event Data" />
              <Tab label="Other" />
            </Tabs>
          </Paper>
        </Grid>

        {value === 0 && (
          <>
            <Grid container item direction="column" justify="center" alignItems="center" md={6}>
              <Typography variant="subtitle1">Number of total users:</Typography>
              <Typography className={classes.largeNumber}>{allDBUsers.users.length}</Typography>
            </Grid>
            <Grid container item direction="column" justify="center" alignItems="center" md={6}>
              <Typography variant="subtitle1">Number of total events:</Typography>
              <Typography className={classes.largeNumber}>
                {allDBEventsAndRounds.events.length}
              </Typography>
            </Grid>

            <Grid container justify="space-between" item>
              <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Week</TableCell>
                      <TableCell align="right">Attendees</TableCell>
                      <TableCell align="right">Repeat attendees</TableCell>
                      <TableCell align="right">Hosts</TableCell>
                      <TableCell align="right">Repeat hosts</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows().map((row) => {
                      const weekOf = Object.keys(row)[0]
                      return (
                        <TableRow key={row.name}>
                          <TableCell component="th" scope="row">
                            {weekOf}
                          </TableCell>
                          <TableCell align="right">{row[weekOf].attendees.length}</TableCell>
                          <TableCell align="right">{row[weekOf].repeatAttendees.length}</TableCell>
                          <TableCell align="right">0</TableCell>
                          <TableCell align="right">0</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </>
        )}
      </Grid>

      {value === 1 && (
        <div className={classes.expansionPanelsContainer}>
          <EventExpansionPanelAdmin eventsAndRoundsData={allDBEventsAndRounds} />
        </div>
      )}

      {value === 2 && (
        <Grid container item direction="column" justify="center" alignItems="center" md={6}>
          <Typography variant="subtitle1">more stuff here</Typography>
        </Grid>
      )}
    </div>
  )
}

export default HRNAnalytics
