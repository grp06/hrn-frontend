import React, { useEffect, useContext, useState } from 'react'

import { useQuery, useLazyQuery } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { useMutation } from 'react-apollo'

import { OnlineUsers } from '../components'

import { useGameContext } from '../context/useGameContext'

import { incrementRound, deleteRounds, resetGameState, bulkInsertRounds } from '../gql/mutations'
import { findUsers, getAllRounds } from '../gql/queries'
import endpointUrl from '../utils/endpointUrl'
import roundRobin from '../utils/roundRobin'

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
    width: '100%',
    height: '100vh',
  },
  btn: {
    margin: '15px',
  },
}))
const useImperativeQuery = (query) => {
  const { refetch } = useQuery(query, { skip: true })

  const imperativelyCallQuery = (variables) => {
    return refetch(variables)
  }

  return imperativelyCallQuery
}
const AdminControl = () => {
  const classes = useStyles()
  const {
    currentRound,
    gameOver,
    setUsers,
    userId,
    setAllRounds,
    setCurrentRound,
    resetEvent,
  } = useGameContext()
  const [bulkInsertRoundsMutation] = useMutation(bulkInsertRounds)
  const callQuery = useImperativeQuery(getAllRounds)

  const [deleteRoundsMutation] = useMutation(deleteRounds)
  const [incrementRoundMutation] = useMutation(incrementRound)
  const [resetGameStateMutation] = useMutation(resetGameState)
  const { loading, error, data: findUsersData } = useQuery(findUsers)

  if (loading || error) return <p>Loading ...</p>
  if (!findUsersData) {
    return <div>no user findUsersData yet</div>
  }
  setUsers(findUsersData.users)

  // if (!findUsersData.onlineUsers.length) return <p>no online users yet</p>

  const createPairings = async () => {
    if (currentRound === 0) {
      const variablesArr = []
      const userIds = findUsersData.users.reduce((all, item) => {
        all.push(item.id)
        return all
      }, [])

      const userIdsWithoutAdmin = userIds.filter((id) => id !== userId)
      // subtracting 1 because admin wont be assigned
      const pairingsArray = roundRobin(findUsersData.users.length - 1, userIdsWithoutAdmin)

      pairingsArray.forEach((round, idx) => {
        round.forEach((pairing) => {
          variablesArr.push({
            partner_x: pairing[0],
            partner_y: pairing[1],
            round_number: idx + 1,
          })
        })
      })
      const res = await bulkInsertRoundsMutation({
        variables: {
          objects: variablesArr,
        },
      })
      setAllRounds(res.data.insert_rounds.returning)
    }
    const {
      data: {
        update_gameState: { returning },
      },
    } = await incrementRoundMutation()
    setCurrentRound(returning[0].currentRound)
  }

  const completeRooms = () => {
    fetch(`${endpointUrl}/complete-rooms`)
      .then((res) => {
        return res.json()
      })
      .then((completedRooms) => {
        console.log('completedRooms = ', completedRooms)
      })
  }

  return (
    <Card className={classes.onlineUsers}>
      <>
        <div className={classes.btn}>
          <Button variant="outlined" onClick={createPairings}>
            {currentRound === 0 ? 'start event' : 'next round'}
          </Button>
        </div>

        <div className={classes.btn}>
          <Button variant="outlined" onClick={completeRooms}>
            Complete Rooms
          </Button>
        </div>
        <div className={classes.btn}>
          <Button
            variant="outlined"
            onClick={async () => {
              await resetGameStateMutation()
              await deleteRoundsMutation()
              resetEvent()
            }}
          >
            Reset rounds/game
          </Button>
        </div>

        <div>
          R0und:
          {currentRound}
        </div>
        <div>{gameOver && <div>game over</div>}</div>

        <Typography>Online Users</Typography>
        <OnlineUsers />
      </>
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
