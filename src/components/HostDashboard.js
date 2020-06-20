import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { useAppContext } from '../context/useAppContext'
import { makeStyles } from '@material-ui/styles'
import { FloatCardXLarge, Loading } from '../common'
import { useQuery } from '@apollo/react-hooks'
import { getHostEventsAndRounds } from '../gql/queries'

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    marginTop: '100px',
  },
}))

let allHostEventsObject = {}

const HostDashboard = () => {
  const classes = useStyles()
  const { user } = useAppContext()
  const { userId } = user
  const [allTimeRSVPed, setAllTimeRSVPed] = useState(0)

  // const calculateEventStats = (eventId) => {
  //   const event = allHostEventsObject.eventId
  //   const numberOfRounds
  // }
  const {
    data: eventsAndRoundsData,
    loading: eventsAndRoundsLoading,
    error: eventsAndRoundsError,
  } = useQuery(getHostEventsAndRounds, {
    variables: {
      userId: userId,
    },
    skip: !userId,
  })

  useEffect(() => {
    if (eventsAndRoundsData && !eventsAndRoundsLoading) {
      // populate allHostEventsObject with each object. The key is the eventId
      eventsAndRoundsData.events.forEach((event) => {
        allHostEventsObject[event.id] = JSON.parse(JSON.stringify(event))
      })

      // calculate all the RSVPed people in all your events and set state
      const totalRSVP = eventsAndRoundsData.events.reduce((total, event) => {
        total += event.event_users.length
        return total
      }, 0)
      setAllTimeRSVPed(totalRSVP)
    }
  }, [eventsAndRoundsData])

  if (!eventsAndRoundsData) {
    return <Loading />
  }

  console.log('allHostEventsObject ->', allHostEventsObject)
  console.log('allTimeRSVPed ->', allTimeRSVPed)

  return (
    <div className={classes.pageContainer}>
      <FloatCardXLarge>
        <Typography variant="h1">Hello There</Typography>
      </FloatCardXLarge>
    </div>
  )
}

export default HostDashboard

// return (
//   <div className={classes.pageContainer}>
//     <Typography variant="h1">Hello There</Typography>
//     <FloatCardXLarge>
//       <div className={classes.rotatedContainer}>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={data}>
//             <Bar dataKey="uv" fill="#8884d8" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </FloatCardXLarge>
//   </div>
// )
