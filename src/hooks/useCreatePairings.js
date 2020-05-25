import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import { useGameContext } from '../context/useGameContext'
import { bulkInsertRounds } from '../gql/mutations'
import samyakAlgo from '../utils/samyakAlgo'
import { findUsers } from '../gql/queries'
import { useStartRound } from '.'
import endpointUrl from '../utils/endpointUrl'

// call API which will disconnect all users from their rooms
// it should also complete the rooms afterwards
// then we want to create new rooms
// then increment
export default function useCreatePairings() {
  const { setUsers, userId, eventId, roundsData, currentRound } = useGameContext()
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
      console.log('shoudl start round ', roundsResponse.returning)
      startRound(roundsResponse.returning)
    }
  }, [roundsResponse])

  const createRoundsMap = (roundData, users) => {
    if (!roundsData || roundData.rounds.length === 0) {
      return {}
    }

    const generateUserMap = (user_id) => {
      const userRounds = roundData.rounds.filter(
        (pairing) => pairing.partnerX_id === user_id || pairing.partnerY_id === user_id
      )
      // This is to get an array of only your partners id for each round as the array element
      return userRounds.map((roundObject) => {
        if (roundObject.partnerX_id === user_id) {
          return roundObject.partnerY_id
        }
        return roundObject.partnerX_id
      })
    }

    const roundsMapObject = users.reduce((all, user) => {
      const map = generateUserMap(user)
      all[user] = map
      return all
    }, {})

    return roundsMapObject
  }

  const createPairings = async () => {
    await fetch(`${endpointUrl}/api/rooms/complete-rooms`)
    const variablesArr = []
    const userIds = findUsersData.users.reduce((all, item) => {
      all.push(item.id)
      return all
    }, [])

    const userIdsWithoutAdmin = userIds.filter((id) => id !== userId)
    const roundsMap = createRoundsMap(roundsData, userIdsWithoutAdmin)
    // subtracting 1 because admin wont be assigned
    const { pairingsArray, userIdsMap } = samyakAlgo(userIdsWithoutAdmin, roundsMap)

    // const pairingsArray = roundRobin(findUsersData.users.length - 1, userIdsWithoutAdmin)
    pairingsArray.forEach((pairing) => {
      variablesArr.push({
        partnerX_id: pairing[0],
        partnerY_id: pairing[1],
        round_number: currentRound + 1,
        event_id: eventId,
      })
    })

    const insertedRounds = await bulkInsertRoundsMutation({
      variables: {
        objects: variablesArr,
      },
    })

    setRoundsResponse(insertedRounds.data.insert_rounds)
  }

  return { createPairings }
}
