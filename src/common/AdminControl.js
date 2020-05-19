import React, { useEffect, useContext, useState } from 'react'

import { useQuery, useLazyQuery } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { useMutation } from 'react-apollo'

import { OnlineUsers, StartNextRound } from '../components'
import { useGameContext } from '../context/useGameContext'
import { incrementRound, deleteRounds, bulkInsertRounds, setRoundToZero } from '../gql/mutations'
import { findUsers, getRoundsData } from '../gql/queries'
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
    setUsers,
    userId,
    setRoundsData,
    setCurrentRound,
    resetEvent,
    roundsData,
  } = useGameContext()
  const [bulkInsertRoundsMutation] = useMutation(bulkInsertRounds)
  const callQuery = useImperativeQuery(getRoundsData)

  const [deleteRoundsMutation] = useMutation(deleteRounds)
  const [setRoundToZeroMutation] = useMutation(setRoundToZero)
  const [incrementRoundMutation] = useMutation(incrementRound)
  const { loading, error, data: findUsersData } = useQuery(findUsers)

  // if (loading || error) return <p>Loading ...</p>
  useEffect(() => {
    if (findUsersData && findUsersData.users) {
      setUsers(findUsersData.users)
    }
  }, [findUsersData])

  // if (!findUsersData.onlineUsers.length) return <p>no online users yet</p>

  const startEvent = async () => {
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
          partnerX_id: pairing[0],
          partnerY_id: pairing[1],
          round_number: idx + 1,
          event_id: 3,
        })
      })
    })
    const res = await bulkInsertRoundsMutation({
      variables: {
        objects: variablesArr,
      },
    }).then((roundsResponse) => {
      const { returning: rounds } = roundsResponse.data.insert_rounds

      const currentRoundObj = rounds.filter((round) => round.round_number === currentRound + 1)

      const allPartnerXs = currentRoundObj.reduce((all, item, index) => {
        all.push(item.partnerX_id)
        return all
      }, [])
      debugger
      fetch(`${endpointUrl}/api/rooms/create-rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allPartnerXs),
      }).then(() => {
        // PASS IN EVENT ID
        incrementRoundMutation()
      })
    })
  }

  const completeRooms = () => {
    fetch(`${endpointUrl}/api/rooms/complete-rooms`)
      .then((res) => {
        return res.json()
      })
      .then((completedRooms) => {
        console.log('completedRooms = ', completedRooms)
      })
  }

  if (!findUsersData) {
    return <div>no user findUsersData yet</div>
  }

  return (
    <Card className={classes.onlineUsers}>
      <>
        <div className={classes.btn}>
          <Button variant="outlined" onClick={startEvent}>
            Start Event
          </Button>
        </div>
        <div className={classes.btn}>
          <StartNextRound />
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
              await deleteRoundsMutation()
              await setRoundToZeroMutation()
            }}
          >
            Reset rounds/game
          </Button>
        </div>

        <div>
          R0und:
          {currentRound}
        </div>

        <Typography>Online Users</Typography>
        <OnlineUsers />
      </>
    </Card>
  )
}

export default AdminControl
