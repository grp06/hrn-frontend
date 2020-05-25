import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import { useGameContext } from '../context/useGameContext'
import { bulkInsertRounds } from '../gql/mutations'
import roundRobin from '../utils/roundRobin'
import samyakAlgo from '../utils/samyakAlgo'
import { findUsers } from '../gql/queries'
import { useStartRound } from '.'

// call API which will disconnect all users from their rooms
// it should also complete the rooms afterwards
// then we want to create new rooms
// then increment
export default function useCreatePairings() {
  const { setUsers, userId, eventId } = useGameContext()
  const { loading, error, data: findUsersData } = useQuery(findUsers)
  const [bulkInsertRoundsMutation] = useMutation(bulkInsertRounds)
  const { startRound } = useStartRound()
  const [roundsResponse, setRoundsResponse] = useState(null)

  useEffect(() => {
    if (findUsersData && findUsersData.users) {
      setUsers(findUsersData.users)
    }
  }, [findUsersData])

  useEffect(() => {
    if (roundsResponse) {
      startRound(roundsResponse.returning)
    }
  }, [roundsResponse])

  const createPairings = async () => {
    const variablesArr = []
    const userIds = findUsersData.users.reduce((all, item) => {
      all.push(item.id)
      return all
    }, [])
    const userIdsWithoutAdmin = userIds.filter((id) => id !== userId)
    console.log('createPairings -> userIdsWithoutAdmin', userIdsWithoutAdmin)

    // subtracting 1 because admin wont be assigned
    const resultOfSamyaksAlgo = samyakAlgo(userIdsWithoutAdmin, {})
    console.log(resultOfSamyaksAlgo)
    // const pairingsArray = roundRobin(findUsersData.users.length - 1, userIdsWithoutAdmin)
    // pairingsArray.forEach((round, idx) => {
    //   round.forEach((pairing) => {
    //     variablesArr.push({
    //       partnerX_id: pairing[0],
    //       partnerY_id: pairing[1],
    //       round_number: idx + 1,
    //       event_id: eventId,
    //     })
    //   })
    // })

    const insertedRounds = await bulkInsertRoundsMutation({
      variables: {
        objects: variablesArr,
      },
    })

    // setRoundsResponse(insertedRounds.data.insert_rounds)
  }

  return { createPairings }
}
