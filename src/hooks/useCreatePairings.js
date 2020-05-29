import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import { useGameContext } from '../context/useGameContext'
import { bulkInsertRounds } from '../gql/mutations'
import samyakAlgo from '../utils/samyakAlgo'
import jorgeAlgo from '../utils/georgeAlgo'
import { findUsers } from '../gql/queries'
import { useStartRound } from '.'
import endpointUrl from '../utils/endpointUrl'

export default function useCreatePairings() {
  const { setUsers, userId, roundsData, currentRound } = useGameContext()
  const { loading, error, data: findUsersData } = useQuery(findUsers)
  const [bulkInsertRoundsMutation] = useMutation(bulkInsertRounds)
  const { startRound } = useStartRound()

  useEffect(() => {
    if (findUsersData && findUsersData.users) {
      setUsers(findUsersData.users)
    }
  }, [findUsersData])

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

  const createPairings = async (attendees, eventId) => {
    await fetch(`${endpointUrl}/api/rooms/complete-rooms`)
    setTimeout(async () => {
      const variablesArr = []

      const userIds = attendees.reduce((all, item) => {
        all.push(item.user.id)
        return all
      }, [])
      userIds.push(userId)
      // const userIdsWithoutAdmin = userIds.filter((id) => id !== userId)
      // if (userIdsWithoutAdmin % 2 !== 0) {
      //   console.log('uneven array')
      //   userIdsWithoutAdmin.push('999999')
      // }
      const roundsMap = createRoundsMap(roundsData, userIds)
      // subtracting 1 because admin wont be assigned
      const { pairingsArray, userIdsMap } = jorgeAlgo(userIds, roundsMap)

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

      startRound(insertedRounds.data.insert_rounds.returning)
    }, 1000)
  }

  return { createPairings }
}
