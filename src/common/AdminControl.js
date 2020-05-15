import React, { useEffect, useContext, useState } from 'react'

import { useQuery, useLazyQuery } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { useMutation } from 'react-apollo'

import { OnlineUsers, StartNextRound } from '../components'
import { GameStateContext } from '../contexts/GameStateContext'
import { incrementRound, insertRound } from '../gql/mutations'
import { findUsers, getAllRounds } from '../gql/queries'
import roundRobin from '../utils/roundRobin'

const useImperativeQuery = (query) => {
  const { refetch } = useQuery(query, { skip: true })

  const imperativelyCallQuery = (variables) => {
    return refetch(variables)
  }

  return imperativelyCallQuery
}

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    display: 'flex',
    maxWidth: 600,
    margin: '0 auto',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '1em',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 200,
  },
  input: {
    marginBottom: '1em',
    marginTop: '1em',
  },
  onlineUsers: {
    width: 200,
    height: '100vh',
  },
}))

const AdminControl = () => {
  const classes = useStyles()
  const userId = parseInt(localStorage.getItem('userID'), 10)

  const { currentRound, gameOver } = useContext(GameStateContext)
  const [insertRoundMutation] = useMutation(insertRound)
  const { loading, error, data } = useQuery(findUsers)
  const [pairingsCreated, setPairingsCreated] = useState(false)
  const callQuery = useImperativeQuery(getAllRounds)
  const [roundsData, setRoundsData] = useState(null)
  if (loading || error) return <p>Loading ...</p>
  // if (!data.onlineUsers.length) return <p>no online users yet</p>

  const createPairings = async () => {
    if (currentRound === 0) {
      const promiseArray = []
      const userIds = data.users.reduce((all, item) => {
        all.push(item.id)
        return all
      }, [])

      const userIdsWithoutAdmin = userIds.filter((id) => id !== userId)
      // subtracting 1 because admin wont be assigned
      const pairingsArray = roundRobin(data.users.length - 1, userIdsWithoutAdmin)
      pairingsArray.forEach((round, idx) => {
        round.forEach((pairing) => {
          promiseArray.push(
            insertRoundMutation({
              variables: {
                partner_x: pairing[0],
                partner_y: pairing[1],
                round_number: idx + 1,
              },
            })
          )
        })
      })

      return Promise.allSettled(promiseArray).then(async () => {
        const allRoundsData = await callQuery()
        return setRoundsData(allRoundsData)
      })
    }
    const allRoundsData = await callQuery()
    return setRoundsData(allRoundsData)
  }

  const completeRooms = () => {
    fetch('https://hrn-api.herokuapp.com/complete-rooms')
      .then((res) => {
        return res.json()
      })
      .then((completedRooms) => {
        console.log('completedRooms = ', completedRooms)
      })
  }

  return (
    <Card className={classes.onlineUsers}>
      <CardContent className={classes.content}>
        <>
          {!pairingsCreated ? (
            <Button variant="outlined" onClick={createPairings}>
              Create Pairings
            </Button>
          ) : (
            <div>pairings created</div>
          )}
          <StartNextRound roundsData={roundsData} />

          <Button variant="outlined" onClick={completeRooms}>
            Complete Rooms
          </Button>
          <div>
            R0und:
            {currentRound}
          </div>
          <div>{gameOver && <div>game over</div>}</div>

          <Typography>Online Users</Typography>
          <OnlineUsers />
        </>
      </CardContent>
    </Card>
  )
}

export default AdminControl

// <Query query={findUsers} variables={{ id: localStorage.getItem('userID') }}>
//   {({ error, loading, data }) => {
//     if (error || loading || !data) {
//       return <div>nothing yet</div>
//     }
//     const { isAdmin } = data.users[0]

//   }}
// </Query>
